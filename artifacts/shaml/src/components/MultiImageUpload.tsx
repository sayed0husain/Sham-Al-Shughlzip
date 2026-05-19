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
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", QUALITY));
    };
    img.onerror = reject;
    img.src = url;
  });
}

async function uploadOne(file: File, onProgress: (p: number) => void): Promise<string> {
  try {
    const filename = `uploads/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const storageRef = ref(storage, filename);
    const task = uploadBytesResumable(storageRef, file, { contentType: file.type });
    return await new Promise<string>((resolve, reject) => {
      task.on("state_changed",
        (snap) => onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 90)),
        reject,
        async () => { try { resolve(await getDownloadURL(task.snapshot.ref)); } catch (e) { reject(e); } }
      );
    });
  } catch {
    onProgress(50);
    const b64 = await compressToBase64(file);
    onProgress(100);
    return b64;
  }
}

interface Props {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
}

export default function MultiImageUpload({ label, values, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setError(null); setUploading(true);
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const url = await uploadOne(files[i], (p) => setProgress(Math.round(((i + p / 100) / files.length) * 100)));
        urls.push(url);
      } catch (err: unknown) {
        setError((err as { message?: string }).message ?? "فشل رفع صورة");
      }
    }
    onChange([...values, ...urls]);
    setUploading(false); setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium" style={{ fontFamily: FONT_LABEL, color: "hsl(20,10%,25%)" }}>{label}</label>
      <div className="flex flex-wrap gap-2">
        {values.map((url, i) => (
          <div key={i} className="relative group">
            <img src={url} alt="" className="h-20 w-20 object-cover rounded-xl" />
            <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: "hsl(0,72%,51%)" }}>✕</button>
          </div>
        ))}
        <button type="button" onClick={() => !uploading && inputRef.current?.click()}
          className="h-20 w-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
          style={{ borderColor: "hsl(30,12%,80%)" }}>
          {uploading
            ? <span className="text-xs text-center px-1" style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)" }}>{progress}%</span>
            : <><span style={{ fontSize: "1.25rem", color: ACCENT }}>+</span><span className="text-xs" style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)" }}>رفع</span></>
          }
        </button>
      </div>
      {error && <p className="text-xs" style={{ color: "hsl(0,72%,45%)", fontFamily: FONT_B }}>⚠️ {error}</p>}
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
    </div>
  );
}
