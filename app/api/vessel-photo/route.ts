import { NextResponse } from 'next/server';
import { del, list, put } from '@vercel/blob';
import { getVessel } from '@/data/vessels';

/**
 * Vessel photograph upload.
 *
 * Vercel runs on a read-only filesystem, so an uploaded file cannot be
 * written into /public on the deployed site. Photos go to Vercel Blob
 * instead, at a path derived from the vessel id with the random suffix
 * disabled, so a vessel's photo is always at the same address and can be
 * looked up without storing a mapping anywhere.
 *
 * NOTE: this endpoint is unauthenticated, because the platform is. Anyone
 * who can reach the site can upload. Turn on Vercel Deployment Protection,
 * or put real auth in front of the app, before this is public.
 */

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export const runtime = 'nodejs';

function configured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function POST(request: Request) {
  if (!configured()) {
    return NextResponse.json(
      {
        error:
          'No Blob store is connected. In Vercel: Storage → Create Database → Blob, connect it to this project, then redeploy.',
      },
      { status: 501 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected a file upload.' }, { status: 400 });
  }

  const id = String(form.get('id') ?? '');
  const file = form.get('file');

  // The id must name a real vessel: it becomes part of the storage path,
  // so an unchecked value would let anyone write anywhere in the store.
  if (!id || !getVessel(id)) {
    return NextResponse.json({ error: 'Unknown vessel.' }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file received.' }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: 'Only JPEG, PNG and WebP images are accepted.' },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `That image is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is 8MB.` },
      { status: 413 },
    );
  }

  // Replacing a photo in a different format would otherwise leave the old
  // one behind at its own extension, and the lookup takes the first match.
  const existing = await list({ prefix: `vessels/${id}.`, limit: 10 });
  await Promise.all(
    existing.blobs
      .filter((b) => b.pathname !== `vessels/${id}.${ext}`)
      .map((b) => del(b.url)),
  );

  const blob = await put(`vessels/${id}.${ext}`, file, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url });
}

export async function DELETE(request: Request) {
  if (!configured()) {
    return NextResponse.json({ error: 'No Blob store is connected.' }, { status: 501 });
  }
  const id = new URL(request.url).searchParams.get('id') ?? '';
  if (!id || !getVessel(id)) {
    return NextResponse.json({ error: 'Unknown vessel.' }, { status: 400 });
  }
  const existing = await list({ prefix: `vessels/${id}.`, limit: 10 });
  await Promise.all(existing.blobs.map((b) => del(b.url)));
  return NextResponse.json({ ok: true });
}
