import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '../lib/supabaseClient'; // adjust the path if needed

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sb:token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  const role = user.user_metadata?.role || 'user';

  if (req.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
