import { createClient } from "@supabase/supabase-js";

// Replace with your project URL and service role key
const supabase = createClient(
  "https://xcpzujhxoccopsgoqoqy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjcHp1amh4b2Njb3BzZ29xb3F5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU5Nzk2OCwiZXhwIjoyMDY2MTczOTY4fQ.jEjcYMA0hTtRQ_yBJs4XS0j-CZnn1zZZDgAz_m3mibA"
);

// Replace with the user's UID you want to confirm
const userId = "6c6ba943-d9d9-485c-be99-0eed2f8a4101";

async function confirmUser() {
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("User confirmed:", data);
  }
}

confirmUser();
