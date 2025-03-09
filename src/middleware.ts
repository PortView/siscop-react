import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isPublicPath = ['/login'].includes(request.nextUrl.pathname)

  // Se estiver na página de login e tiver token, redireciona para /gerencia
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/gerencia', request.url))
  }

  // Se não estiver em uma página pública e não tiver token, redireciona para /login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
