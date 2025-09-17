import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


// Declare email and password variables before using them
const email = "";
const password = "";
/**
 * Replace the hardcoded email and password with function parameters.
 * This function creates a new user with the provided email and password.
 */
export async function createSupabaseUser(email: string, password: string) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  return { data, error };
}
const { data, error } = await supabaseAdmin.auth.admin.createUser({
  email,
  password,
  email_confirm: true, // ✅ mark user as confirmed
});
