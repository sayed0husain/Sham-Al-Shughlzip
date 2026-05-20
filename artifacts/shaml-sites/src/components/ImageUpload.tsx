import { useRef, useState } from "react";
import { compressToBase64, formatBytes } from "../lib/imageUtils";

interface Props {
  value: string;
  onChange: (base64: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label = "صورة", className = "" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { setError("الملف ليس صورة"); return; }
    setLoading(true); setError("");
    try {
      const b64 = await compressToBase64(file);
      onChange(b64);
    } catch { setError("فشل في معالجة الصورة"); }
    finally { setLoading(false); }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const sizeStr = value ? formatBytes(Math.round(value.length * 0.75)) : null;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="relative border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors text-center min-h-[100px] flex flex-col items-center justify-center gap-2"
      >
        {loading && <div className="text-sm text-muted-foreground">جاري المعالجة...</div>}
        {!loading && value && (
          <img src={value} alt="preview" className="max-h-40 max-w-full rounded-lg object-contain mx-auto" />
        )}
        {!loading && !value && (
          <>
            <span className="text-3xl">🖼️</span>
            <p className="text-sm text-muted-foreground">اسحب صورة هنا أو اضغط للاختيار</p>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
      {sizeStr && <p className="text-xs text-muted-foreground font-num">الحجم: {sizeStr}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
      {value && (
        <button type="button" onClick={() => onChange("")}
          className="text-xs text-destructive hover:underline">
          إزالة الصورة
        </button>
      )}
    </div>
  );
}
