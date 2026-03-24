
import { createClient } from '@supabase/supabase-js';

const getValidUrl = (url: string | undefined): string => {
  const envUrl = url || import.meta.env.VITE_SUPABASE_URL;

  // Handle missing or clearly invalid values
  if (!envUrl || typeof envUrl !== 'string' || envUrl.trim() === '' || envUrl === 'undefined' || envUrl === 'null') {
    console.error('CRITICAL: Supabase URL is missing or invalid. Check your .env file.');
    return ''; // Return empty string so createClient fails fast with a clear error
  }

  // Clean up the URL (remove quotes, whitespace)
  let cleaned = envUrl.trim().replace(/['"]/g, '');

  // Ensure protocol
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }

  return cleaned;
};

const supabaseUrl = getValidUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim().replace(/['"]/g, '');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration is incomplete. Authentication will not work.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
