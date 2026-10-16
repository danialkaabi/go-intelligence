import { NextResponse } from 'next/server';
import { search } from '@/lib/search';

/**
 * Platform search.
 *
 * The browser cannot hold the database — thirteen thousand vessels and eight
 * thousand companies are several megabytes — so the command palette asks
 * here on every keystroke and this answers with a handful of rows.
 *
 * Read-only, and it returns nothing the site does not already show on its
 * own pages.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get('q') ?? '';
  const result = search(q);
  return NextResponse.json(result, {
    // A keystroke's answer is worth nothing a moment later, and the data
    // behind it changes on deploy.
    headers: { 'Cache-Control': 'no-store' },
  });
}
