import { createClient } from "@supabase/supabase-js";

// Ganti dengan URL dan anon key project Anda
const supabase = createClient(
  "https://xcpzujhxoccopsgoqoqy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjcHp1amh4b2Njb3BzZ29xb3F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTc5NjgsImV4cCI6MjA2NjE3Mzk2OH0.phzL2hPLMGPW7O2YPavO_nj6HTr6uDuhL4VDkfEKdqM"
);

async function registerAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: "marketing@unklab.ac.id", // email admin
    password: "unklab", // password baru
    options: {
      data: { role: "admin" }, // metadata admin
    },
  });

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Success:", data);
  }
}

registerAdmin();
