// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import pdfjsLib from "https://esm.sh/pdfjs-dist@3.11.174/legacy/build/pdf.js";

console.log("Hello from Functions!")

function getFileExtension(filename: string) {
  return filename.split('.').pop()?.toLowerCase() || '';
}
function isPDF(filename: string) {
  return getFileExtension(filename) === 'pdf';
}
function isImage(filename: string) {
  return ['png', 'jpg', 'jpeg', 'webp'].includes(getFileExtension(filename));
}

async function extractPDFText(fileBuffer: Uint8Array) {
  const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
  const pdf = await loadingTask.promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n";
  }
  return fullText;
}

async function extractImageTextWithOpenAI(fileBuffer: Uint8Array, apiKey: string, ext: string) {
  // Convert Uint8Array to base64
  const base64 = btoa(String.fromCharCode(...fileBuffer));
  // Tentukan mime type
  let mime = 'image/png';
  if (ext === 'jpg' || ext === 'jpeg') mime = 'image/jpeg';
  if (ext === 'webp') mime = 'image/webp';
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Extract all readable text from this image." },
            { type: "image_url", image_url: { "url": `data:${mime};base64,${base64}` } }
          ]
        }
      ],
      max_tokens: 1024
    })
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

serve(async (req) => {
  // Ambil row_id dari body request
  const { row_id } = await req.json();

  // Inisialisasi Supabase client dengan service role key
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Ambil data row dari crawled_data
  const { data, error } = await supabase
    .from('crawled_data')
    .select('*')
    .eq('id', row_id)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ error: 'Data not found' }), { status: 404 });
  }

  // Ambil URL file dari data
  const fileUrl = data.url;
  if (!fileUrl) {
    return new Response(JSON.stringify({ error: 'No file URL found' }), { status: 400 });
  }

  // Ambil path relatif dari fileUrl (handle jika fileUrl adalah URL lengkap)
  let filePath = fileUrl;
  try {
    // Cek jika fileUrl adalah URL lengkap
    const urlObj = new URL(fileUrl);
    // Ambil path setelah '/manual-uploads/'
    const match = urlObj.pathname.match(/manual-uploads\/(.+)$/) || urlObj.pathname.match(/manual-uploads\/(.+)/);
    if (match && match[1]) {
      filePath = match[1];
    }
  } catch {
    // Jika fileUrl bukan URL, fallback ke logic lama
    const prefix = 'manual-uploads/';
    if (fileUrl.startsWith(prefix)) {
      filePath = fileUrl.slice(prefix.length);
    }
  }
  console.log('fileUrl:', fileUrl);
  console.log('bucket:', 'manual-uploads');
  console.log('filePath:', filePath);

  const { data: fileData, error: fileError } = await supabase
    .storage
    .from('manual-uploads')
    .download(filePath);

  if (fileError || !fileData) {
    console.log('Storage download error:', fileError);
    await supabase.from('crawled_data').update({ content: 'Gagal download file dari storage.' }).eq('id', row_id);
    return new Response(JSON.stringify({ error: 'Failed to download file from storage', detail: fileError }), { status: 500 });
  }
  const fileBuffer = new Uint8Array(await fileData.arrayBuffer());

  // Deteksi tipe file dan ekstrak konten
  let extractedText = "";
  const ext = getFileExtension(filePath);
  const apiKey = Deno.env.get('OPENAI_API_KEY')!;
  try {
    if (isPDF(filePath)) {
      extractedText = await extractPDFText(fileBuffer);
    } else if (isImage(filePath)) {
      extractedText = await extractImageTextWithOpenAI(fileBuffer, apiKey, ext);
    } else {
      extractedText = "Ekstensi file tidak didukung untuk ekstraksi otomatis.";
    }
  } catch (err) {
    extractedText = `Ekstraksi gagal: ${err}`;
  }

  // Simpan hasil ekstraksi ke database
  await supabase
    .from('crawled_data')
    .update({ content: extractedText })
    .eq('id', row_id);

  return new Response(JSON.stringify({ message: 'File downloaded & content extracted', fileSize: fileBuffer.length, contentLength: extractedText.length }), { status: 200 });
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/extract-content' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
