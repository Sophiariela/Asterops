import { useEffect, useRef, useState, type ElementType, type KeyboardEvent, type MouseEvent } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { resolveUploadUrl } from '../../lib/api';

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
  onUpload: (file: File) => void;
  className?: string;
  label?: string;
  rounded?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const resolved = resolveUploadUrl(src);

  return (
    <div
      className={`relative group ${rounded} overflow-hidden bg-gradient-to-br from-ASTER-100 to-ASTER-50 cursor-pointer ${className}`}
      onClick={() => inputRef.current?.click()}
    >
      {resolved ? (
        <img src={resolved} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-ASTER-400 gap-1.5 min-h-[80px]">
          <ImageIcon size={24} />
          <span className="text-[11px] font-bold">{label}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/35 transition-colors flex items-center justify-center">
        <span className="text-white text-[11px] font-bold bg-ink-950/70 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          {resolved ? 'Replace photo' : label}
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
