import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/tournaments';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
