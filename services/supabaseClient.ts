
import { createClient } from '@supabase/supabase-js';

const getValidUrl = (url: string | undefined): string => {
  // Handle missing or clearly invalid values
  if (!url || typeof url !== 'string' || url.trim() === '' || url === 'undefined' || url === 'null') {
    return 'https://placeholder.supabase.co';
  }
  
  // Clean up the URL (remove quotes, whitespace)
  let cleaned = url.trim().replace(/['"]/g, '');
  
  // Ensure protocol
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }
  
  // Final validation attempt
  try {
    new URL(cleaned);
    return cleaned;
  } catch (e) {
    console.error('Invalid Supabase URL provided:', cleaned);
    return 'https://placeholder.supabase.co';
  }
};

const supabaseUrl = getValidUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key').trim().replace(/['"]/g, '');

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY || 
    import.meta.env.VITE_SUPABASE_URL === 'undefined' || import.meta.env.VITE_SUPABASE_ANON_KEY === 'undefined') {
  console.warn('Supabase URL or Anon Key is missing or invalid. Please check your environment variables in AI Studio.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
