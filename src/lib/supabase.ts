import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  member_since: string;
  gender: string | null;
  style: string | null;
  colors: string | null;
  fit: string | null;
  occasions: string | null;
  comfort_level: string | null;
  created_at: string;
  updated_at: string;
}
