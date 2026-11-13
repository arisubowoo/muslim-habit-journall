MUSLIM HABIT JOURNAL 2027 (Supabase Integrated)
​Panduan konfigurasi backend Supabase dan deployment Vercel.
​Konfigurasi Supabase RLS (Row Level Security)
​Pastikan 4 tabel berikut telah dibuat di database Supabase Anda beserta kebijakan RLS (Row Level Security) agar setiap pengguna hanya dapat membaca dan menulis datanya sendiri (auth.uid() = user_id):
​1. profiles (id uuid PK references auth.users, full_name text, updated_at timestamptz)
​2. worship_logs (id uuid PK, user_id uuid references auth.users, log_date date, wajib jsonb, sunnah jsonb, syukur text, target text, evaluasi text, doa text, updated_at timestamptz)
​3. journal_entries (id uuid PK, user_id uuid references auth.users, entry_date date, syukur text, target text, evaluasi text, doa text, updated_at timestamptz)
​4. quran_progress (id uuid PK, user_id uuid references auth.users, total_pages int, last_surah text, last_ayat int, updated_at timestamptz)
​Cara Memasukkan Kunci Supabase
