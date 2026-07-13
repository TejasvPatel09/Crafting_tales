// Fill these in from Supabase → Project Settings → API, after creating your project.
// The anon key is safe to expose in client-side code — it only grants access allowed by RLS policies.
const SUPABASE_URL = 'https://nbfdkecpyubyorlstvul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZmRrZWNweXVieW9ybHN0dnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MTM0ODUsImV4cCI6MjA5OTQ4OTQ4NX0.pxRkWKDu-wnLUnzuZxSD6RjkOEtwSAm96eXlmvDXiXY';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
