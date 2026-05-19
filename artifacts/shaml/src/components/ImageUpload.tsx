import { useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

const ACCENT = "hsl(8, 61%, 41%)";
const FONT_B = "'Tajawal','Arial',sans-serif";
const FONT_LABEL = "'Zaatar','Reem Kufi',sans-serif";
const MAX_PX = 900;
const QUALITY = 0.78;

async function compressToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const ratio = Math.min(1, MAX_PX / Math.max(img.width, img.height));
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", QUALITY));
    };
    img.onerror = reject;
    img.src = url;
  });
}

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
}

export default function ImageUpload({ label, value, onChange, accept = "image/*" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null); setUploading(true); setProgress(5);

    /* ── Try Firebase Storage first ── */
    try {
      const filename = `uploads/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const storageRef = ref(storage, filename);
      const task = uploadBytesResumable(storageRef, file, { contentType: file.type });
      await new Promise<void>((resolve, reject) => {
        task.on("state_changed",
          (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 90)),
          reject,
          async () => { try { onChange(await getDownloadURL(task.snapshot.ref)); resolve(); } catch (e) { reject(e); } }
        );
      });
      setProgress(100);
      return;
    } catch {
      /* Storage failed — fall back to base64 stored inline */
    }

    /* ── Fallback: compress + base64 ── */
    try {
      setProgress(50);
      const b64 = await compressToBase64(file);
      setProgress(100);
      onChange(b64);
    } catch (err: unknown) {
      setError((err as { message?: string }).message ?? "فشل رفع الصورة");
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium" style={{ fontFamily: FONT_LABEL, color: "hsl(20,10%,25%)" }}>{label}</label>
      <div
        className="relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden gap-2"
        style={{ borderColor: error ? "hsl(0,72%,51%)" : value ? ACCENT : "hsl(30,12%,80%)", minHeight: 100 }}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {value && !uploading && (
          <img src={value} alt="" className="max-h-24 object-contain rounded-lg" />
        )}
        {uploading ? (
          <div className="flex flex-col items-center gap-2 w-full px-4">
            <span className="text-sm" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>جاري الرفع... {progress}%</span>
            <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "hsl(30,12%,88%)" }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: ACCENT }} />
            </div>
          </div>
        ) : (
          <span className="text-sm text-center px-3" style={{ color: "hsl(20,8%,55%)", fontFamily: FONT_B }}>
            {value ? "اضغط لتغيير الصورة" : "اضغط لرفع الصورة"}
          </span>
        )}
        {value && !uploading && (
          <button onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="text-xs px-3 py-1 rounded-lg hover:opacity-75 transition-opacity"
            style={{ backgroundColor: "hsl(30,10%,90%)", color: "hsl(20,8%,40%)", fontFamily: FONT_B }}>
            حذف
          </button>
        )}
      </div>
      {error && <p className="text-xs mt-0.5" style={{ color: "hsl(0,72%,45%)", fontFamily: FONT_B }}>⚠️ {error}</p>}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFile} />
    </div>
  );
}
