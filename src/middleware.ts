// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import getOrCreateDB from './models/server/dbSetup'
import getOrCreateStorage from './models/server/storageSetup'

export async function middleware(request: NextRequest) {
  await Promise.all([getOrCreateDB(), getOrCreateStorage()])
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Run on everything EXCEPT system assets AND auth pages
    // negative lookahead allows exclusions
    '/((?!api|_next/static|_next/image|favicon.ico|login|register|logout).*)',
  ],
}
