import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Clock, DollarSign, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
  data?: any;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      text: 'Selamat datang di UNKLAB Info Bot! 👋\n\nSaya bisa membantu Anda mendapatkan informasi tentang:\n• Program studi dan biaya kuliah\n• Fasilitas kampus\n• Jadwal pendaftaran\n• Informasi umum UNKLAB\n\nSilakan tanyakan apa yang ingin Anda ketahui!',
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        'Berapa biaya kuliah Teknik Informatika?',
        'Apa saja fasilitas kampus?',
        'Dimana lokasi UNKLAB?',
        'Program studi apa saja yang tersedia?'
      ]
    };
    setMessages([welcomeMessage]);
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  async function searchSupabase(keywords: string[]) {
    let combinedResults: any[] = [];
  
    for (const keyword of keywords) {
      const { data, error } = await supabase
        .from('crawled_data')
        .select('title, content, url')
        .ilike('content', `%${keyword}%`)
        .limit(5);
  
      if (!error && data) {
        combinedResults = [...combinedResults, ...data];
      }
    }
  
    // Hapus duplikat berdasarkan URL atau judul
    const unique = Array.from(
      new Map(combinedResults.map(item => [item.url, item])).values()
    );
  
    return unique;
  }
  

  async function getSearchKeywordsFromOpenAI(userMessage: string) {
    const prompt = `Ambilkan 3 kata kunci pencarian (dalam bahasa Indonesia) dari pertanyaan berikut, pisahkan dengan koma.\n\nPertanyaan: ${userMessage}\nKata kunci:`;
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Ambil kata kunci dari pertanyaan user.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 32
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || userMessage;
  }

  async function getOpenAIAnswer(userMessage: string, contextData: any[]) {
    const contextText = contextData.map((item) =>
      `Judul: ${item.title}\nKonten: ${item.content}`
    ).join('\n---\n');

    const prompt = `Berikut informasi yang saya miliki dari situs unklab.ac.id:\n\n${contextText}\n\nPertanyaan: ${userMessage}\n\nJawaban:`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Kamu adalah chatbot resmi Universitas Klabat. Jawablah hanya berdasarkan informasi yang diberikan dalam konteks.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 700
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'Maaf, saya tidak dapat menemukan jawaban saat ini.';
  }

  async function getOpenAIAnswerFromInternet(userMessage: string) {
    const prompt = `Pertanyaan user: ${userMessage}\n\nJawab dengan jelas, akurat, dan lengkap dalam bahasa Indonesia. Jangan sebutkan bahwa Anda AI.`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Kamu adalah asisten cerdas yang menjawab semua pertanyaan umum dalam bahasa Indonesia secara informatif dan sopan.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 512
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'Maaf, saya tidak dapat menemukan jawaban saat ini.';
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
  
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
  
    try {
      const searchKeywords = await getSearchKeywordsFromOpenAI(inputValue);
      const keywordsArray = searchKeywords.split(',').map(k => k.trim());
      const relevantData = await searchSupabase(keywordsArray);

  
      let answer: string;
  
      if (relevantData.length > 0) {
        // Jika ada data dari crawling → gunakan sebagai konteks ke OpenAI
        answer = await getOpenAIAnswer(inputValue, relevantData);
      } else {
        // Jika tidak ada data crawling → gunakan OpenAI tanpa konteks
        answer = await getOpenAIAnswerFromInternet(inputValue);
      }
  
      const botResponse: Message = {
        id: Date.now().toString(),
        text: answer,
        sender: 'bot',
        timestamp: new Date()
      };
  
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: 'Terjadi kesalahan saat memproses pesan. Silakan coba lagi nanti.',
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-purple-100">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
            <Bot className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">UNKLAB Info Bot</h3>
              <Sparkles className="h-4 w-4 text-purple-200" />
            </div>
            <p className="text-purple-100 text-sm flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Siap membantu 24/7
            </p>
          </div>
        </div>
      </div>

      <div className="h-96 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-purple-50/30 to-white">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
              message.sender === 'user' 
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-l-2xl rounded-tr-2xl shadow-lg' 
                : 'bg-white border border-purple-100 rounded-r-2xl rounded-tl-2xl shadow-lg'
            } p-4`}>
              <div className="text-sm">
                {message.text}
              </div>
              <div className="text-xs mt-2 flex items-center gap-1 text-gray-500">
                <Clock className="h-3 w-3" />
                {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-purple-100 rounded-r-2xl rounded-tl-2xl shadow-lg p-4 max-w-xs">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-purple-100 bg-white">
        <div className="flex space-x-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tanyakan tentang UNKLAB..."
            className="flex-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage} 
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-3 text-xs text-gray-500 text-center flex items-center justify-center gap-1">
          <Sparkles className="h-3 w-3 text-purple-400" />
          Ketik pertanyaan Anda atau klik salah satu saran di atas
        </div>
      </div>
    </div>
  );
};
