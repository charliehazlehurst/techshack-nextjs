import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = 'https://faomnoqjqwksuskjstum.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhb21ub3FqcXdrc3Vza2pzdHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNzM0ODgsImV4cCI6MjA2MjY0OTQ4OH0.L2NwtsveWv11Bw8WzdbJecY6eL1uh5YAcFRD0TDgcF8';

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
