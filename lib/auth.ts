import { supabase } from './supabaseClient';
import { supabaseAdmin } from './supabaseAdmin'; // change to named import if that's how you export it

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (username: string, email: string, password: string) => {
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // set to false if you want confirmation
  });

  if (authError) throw new Error(authError.message);

  const user = authData.user;
  if (!user?.id) throw new Error('User creation failed.');

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert([{ id: user.id, email, username, role: 'user' }]);

  if (profileError) throw new Error(profileError.message);

  return user;
};

// ✅ Add this so /api/me can verify JWTs or session tokens
export const verifyToken = async (token: string) => {
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) {
    throw new Error('Invalid or expired token');
  }

  return data.user;
};
