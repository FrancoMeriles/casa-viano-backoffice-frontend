import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) return NextResponse.redirect(new URL('/login', request.url))

  try {
    console.log('en el middleware')
    console.log(process.env.JWT_SECRET)
    await jwtVerify(token, new TextEncoder().encode('secret'))
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
