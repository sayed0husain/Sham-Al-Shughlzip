import { useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

const ACCENT = "hsl(8, 61%, 41%)";

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
}

export default function ImageUpload({ label, value, onChange, accept = "image/*" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => { console.error(err); setUploading(false); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        onChange(url);
        setUploading(false);
        setProgress(0);
      }
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-sm font-medium"
        style={{ fontFamily: "'Zaatar','Reem Kufi',sans-serif", color: "hsl(20,10%,25%)" }}
      >
        {label}
      </label>
      <div
        className="relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-5 cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
        style={{ borderColor: value ? ACCENT : "hsl(30,12%,80%)" }}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <img src={value} alt="" className="max-h-24 object-contain rounded-lg" />
        ) : (
          <span className="text-sm" style={{ color: "hsl(20,8%,55%)", fontFamily: "'Tajawal',sans-serif" }}>
            {uploading ? `جاري الرفع... ${progress}%` : "اضغط لرفع الصورة"}
          </span>
        )}
        {uploading && (
          <div className="absolute bottom-0 left-0 h-1 transition-all" style={{ width: `${progress}%`, backgroundColor: ACCENT }} />
        )}
      </div>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFile} />
    </div>
  );
}
