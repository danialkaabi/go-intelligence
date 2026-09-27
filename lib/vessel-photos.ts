import { cache } from 'react';
import { list } from '@vercel/blob';

/**
 * Uploaded vessel photographs.
 *
 * Uploads are stored at vessels/<id>.<ext> with the random suffix disabled,
 * so the id alone finds them and no mapping has to be kept anywhere.
 *
 * Everything here returns empty when no Blob store is connected, so the
 * platform runs perfectly well without one — the drop zone simply explains
 * what to set up.
 */

export const blobConfigured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** Every uploaded photo, keyed by vessel id.
 *
 *  Wrapped in React's cache so a list page resolving fifty thumbnails makes
 *  one request rather than fifty. */
export const uploadedPhotoMap = cache(
  async (): Promise<Map<string, string>> => {
    if (!blobConfigured()) return new Map();
    try {
      const out = new Map<string, string>();
      let cursor: string | undefined;
      do {
        const page = await list({ prefix: 'vessels/', limit: 1000, cursor });
        for (const b of page.blobs) {
          // "vessels/astro-aurora.jpg" -> "astro-aurora"
          const id = b.pathname.slice('vessels/'.length).replace(/\.[^.]+$/, '');
          if (id) out.set(id, b.url);
        }
        cursor = page.hasMore ? page.cursor : undefined;
      } while (cursor);
      return out;
    } catch {
      // A missing or revoked token must not take a page down.
      return new Map();
    }
  },
);

export async function uploadedPhotoUrl(id: string): Promise<string | undefined> {
  return (await uploadedPhotoMap()).get(id);
}
