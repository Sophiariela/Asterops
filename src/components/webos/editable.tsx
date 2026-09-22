import { useEffect, useRef, useState, type DragEvent, type ElementType, type KeyboardEvent, type MouseEvent } from 'react';
import { Image as ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react';
import { resolveUploadUrl } from '../../lib/api';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const EDITABLE_HOVER =
  'cursor-text rounded transition-shadow hover:shadow-[0_0_0_2px_rgba(124,58,237,0.4)] hover:shadow-ASTER-400 outline-none';

export function EditableText({
  value,
  onSave,
  as: Tag = 'span',
  className = '',
  multiline = false,
  placeholder = 'Click to edit',
}: {
  value: string;
  onSave: (value: string) => void;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
    else setDraft(value);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') cancel();
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      commit();
    }
  };

  if (editing) {
    return multiline ? (
      <textarea
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        rows={Math.max(2, draft.split('\n').length)}
        className={`${className} w-full bg-white text-ink-900 rounded-lg px-2 py-1.5 outline-none ring-2 ring-ASTER-500 resize-y`}
      />
    ) : (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        className={`${className} w-full bg-white text-ink-900 rounded-lg px-2 py-1 outline-none ring-2 ring-ASTER-500`}
      />
    );
  }

  return (
    <Tag onClick={(e: MouseEvent) => { e.stopPropagation(); setEditing(true); }} className={`${className} ${EDITABLE_HOVER} whitespace-pre-line`} title="Click to edit">
      {value || placeholder}
    </Tag>
  );
}

export function EditableImage({
  src,
  onUpload,
  className = '',
  label = 'Add photo',
  rounded = 'rounded-2xl',
}: {
  src: string | null | undefined;
  onUpload: (file: File) => Promise<void>;
  className?: string;
  label?: string;
  rounded?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Once the parent refetches and passes a new (or updated) src down, the
  // local optimistic preview has done its job — hand display back to the
  // real, resolved URL. Until then the local preview bridges the gap so the
  // photo never flashes back to the placeholder while the refetch is in flight.
  useEffect(() => {
    setPreviewUrl(null);
  }, [src]);

  // Revokes the previous blob URL exactly when replaced by a new one (or on
  // unmount) — otherwise every upload leaks the object URL for the session.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resolved = previewUrl ?? resolveUploadUrl(src);

  const handleFile = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Use JPG, PNG or WEBP.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('File is too large. Max size is 10MB.');
      return;
    }
    setError('');
    setSuccess(false);
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    onUpload(file)
      .then(() => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 1800);
      })
      .catch(() => setError('Could not upload this photo. Try again.'))
      .finally(() => setUploading(false));
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`relative group ${rounded} overflow-hidden bg-gradient-to-br from-ASTER-100 to-ASTER-50 cursor-pointer transition-shadow ${dragOver ? 'ring-2 ring-ASTER-500 ring-offset-2' : ''} ${className}`}
      onClick={() => !uploading && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      {resolved ? (
        <img src={resolved} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-ASTER-400 gap-1.5 min-h-[80px]">
          <ImageIcon size={24} />
          <span className="text-[11px] font-bold">{dragOver ? 'Drop to upload' : label}</span>
        </div>
      )}

      {!uploading && (
        <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/35 transition-colors flex items-center justify-center">
          <span className="text-white text-[11px] font-bold bg-ink-950/70 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            {resolved ? 'Replace photo' : label}
          </span>
        </div>
      )}

      {uploading && (
        <div className="absolute inset-0 bg-ink-950/45 flex items-center justify-center">
          <Loader2 size={20} className="text-white animate-spin" />
        </div>
      )}

      {success && (
        <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white rounded-full p-1 shadow">
          <Check size={12} strokeWidth={3} />
        </div>
      )}

      {error && (
        <div className="absolute inset-x-0 bottom-0 bg-rose-600 text-white text-[10px] font-semibold px-2 py-1 flex items-center gap-1">
          <AlertCircle size={11} className="shrink-0" /> <span className="truncate">{error}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
