'use client';

import { useCallback, useRef, useState } from 'react';
import { IconClose, IconDownload, IconFleet } from './Icons';

type State =
  | { kind: 'idle' }
  | { kind: 'uploading'; preview: string }
  | { kind: 'error'; message: string };

/**
 * The vessel photograph, and the way one gets added.
 *
 * Drop a file (or pick one) and it uploads to Vercel Blob, so it is visible
 * to everyone and survives redeploys. Where a photo was supplied by hand in
 * data/vessel-details.ts, that one is shown and the drop zone offers to
 * override it rather than silently replacing it.
 */
export default function VesselPhotoDrop({
  vesselId,
  name,
  initialUrl,
  curatedUrl,
  configured,
}: {
  vesselId: string;
  name: string;
  /** Whatever should be displayed now: an upload, or the curated file. */
  initialUrl?: string;
  /** A photo committed to the repo, which an upload would sit on top of. */
  curatedUrl?: string;
  /** Whether a Blob store is connected. */
  configured: boolean;
}) {
  const [url, setUrl] = useState<string | undefined>(initialUrl);
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      if (!configured) {
        setState({
          kind: 'error',
          message:
            'No Blob store is connected yet. In Vercel: Storage → Create Database → Blob, connect it to this project, then redeploy.',
        });
        return;
      }
      const preview = URL.createObjectURL(file);
      setState({ kind: 'uploading', preview });
      try {
        const body = new FormData();
        body.append('id', vesselId);
        body.append('file', file);
        const res = await fetch('/api/vessel-photo', { method: 'POST', body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Upload failed.');
        // Cache-bust so a replacement shows immediately at the same path.
        setUrl(`${data.url}?v=${Date.now()}`);
        setState({ kind: 'idle' });
      } catch (e) {
        setState({ kind: 'error', message: e instanceof Error ? e.message : 'Upload failed.' });
      } finally {
        URL.revokeObjectURL(preview);
      }
    },
    [configured, vesselId],
  );

  const remove = useCallback(async () => {
    try {
      const res = await fetch(`/api/vessel-photo?id=${encodeURIComponent(vesselId)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Could not remove.');
      setUrl(curatedUrl);
      setState({ kind: 'idle' });
    } catch (e) {
      setState({ kind: 'error', message: e instanceof Error ? e.message : 'Could not remove.' });
    }
  }, [vesselId, curatedUrl]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const showing = state.kind === 'uploading' ? state.preview : url;

  return (
    <div className="stack g10">
      <div
        className={`photo-drop${over ? ' is-over' : ''}${showing ? ' has-photo' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        onClick={() => !showing && inputRef.current?.click()}
        role={showing ? undefined : 'button'}
        tabIndex={showing ? undefined : 0}
        onKeyDown={(e) => {
          if (!showing && (e.key === 'Enter' || e.key === ' ')) inputRef.current?.click();
        }}
        aria-label={showing ? undefined : `Add a photograph of ${name}`}
      >
        {showing ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={showing} alt={name} className="photo-drop-img" />
            {state.kind === 'uploading' && (
              <div className="photo-drop-veil">
                <span className="live">
                  <span className="dot" />
                  Uploading
                </span>
              </div>
            )}
            {state.kind !== 'uploading' && (
              <div className="photo-drop-tools">
                <button
                  className="btn btn--quiet btn--sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  <IconDownload size={13} />
                  Replace
                </button>
                <button
                  className="btn btn--quiet btn--sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove();
                  }}
                >
                  <IconClose size={13} />
                  Remove
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="photo-drop-empty">
            <span className="empty-mark">
              <IconFleet size={22} />
            </span>
            <span className="empty-title">
              {over ? 'Drop to upload' : 'No photograph recorded'}
            </span>
            <span className="empty-body">
              Drag a photograph here, or click to choose one. JPEG, PNG or
              WebP, up to 8MB.
            </span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = '';
          }}
        />
      </div>

      {state.kind === 'error' && (
        <p style={{ fontSize: 12.5, color: 'var(--red)', lineHeight: 1.6 }}>
          {state.message}
        </p>
      )}

      {url && curatedUrl && url !== curatedUrl && (
        <p className="muted" style={{ fontSize: 12 }}>
          Showing an uploaded photograph. Removing it falls back to the one
          committed in <span className="mono">data/vessel-details.ts</span>.
        </p>
      )}
    </div>
  );
}
