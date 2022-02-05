import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const { pathname } = req.nextUrl
    if (pathname == '/') {
      return NextResponse.redirect('/tournaments');
    }
    return NextResponse.next()
}