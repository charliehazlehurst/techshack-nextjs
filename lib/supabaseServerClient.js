// lib/supabaseServerClient.js
import { createServerClient } from '@supabase/ssr'

export const createSupabaseServerClient = (req, res) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies[name]
        },
        set(name, value, options) {
          res.cookie(name, value, options)
        },
        remove(name, options) {
          res.clearCookie(name, options)
        },
      },
    }
  )
}
