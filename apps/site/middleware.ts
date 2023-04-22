import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  console.log(res, req)
  const supabase = createMiddlewareSupabaseClient({ req, res })
  await supabase.auth.getSession()
  return res
}

export const config = {
  matcher: '/foo/:path*',
}
