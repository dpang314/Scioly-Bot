import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === '/') {
    return NextResponse.redirect('/tournaments');
  }
  return NextResponse.next();
}
