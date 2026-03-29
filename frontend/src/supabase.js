import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cmffwpcjumjgpjekqxrp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtZmZ3cGNqdW1qZ3BqZWtxeHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NzA5NzcsImV4cCI6MjA5MDM0Njk3N30.cuETV7D34O-uCr0CJk1NbibQstkgLMQfP4iVTRPDXGM"; // ✅ FIX

export const supabase = createClient(supabaseUrl, supabaseKey);