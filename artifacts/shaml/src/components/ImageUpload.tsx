import { useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

const ACCENT = "hsl(8, 61%, 41%)";
const FONT_B = "'Tajawal','Arial',sans-serif";
const FONT_LABEL = "'Zaatar','Reem Kufi',sans-serif";

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

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const filename = `projects/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const storageRef = ref(storage, filename);
      const task = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
      });

      await new Promise<void>((resolve, reject) => {
        task.on(
          "state_changed",
          (snap) => {
            const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            setProgress(pct);
          },
          (err) => {
            reject(err);
          },
          async () => {
            try {
              const url = await getDownloadURL(task.snapshot.ref);
              onChange(url);
              resolve();
            } catch (err) {
              reject(err);
            }
          }
        );
      });
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const msg = (err as { message?: string }).message ?? "فشل الرفع";
      if (msg.includes("storage/unauthorized") || msg.includes("permission")) {
        setError("لا توجد صلاحية — تأكد من تفعيل Firebase Storage وقواعد الوصول");
      } else if (msg.includes("storage/unknown") || msg.includes("CORS")) {
        setError("خطأ في الاتصال — تأكد من إعداد CORS في Firebase Storage");
      } else {
        setError(msg);
      }
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-sm font-medium"
        style={{ fontFamily: FONT_LABEL, color: "hsl(20,10%,25%)" }}
      >
        {label}
      </label>
      <div
        className="relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden gap-2"
        style={{ borderColor: error ? "hsl(0,72%,51%)" : value ? ACCENT : "hsl(30,12%,80%)", minHeight: 100 }}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {value && !uploading && (
          <img src={value} alt="" className="max-h-20 object-contain rounded-lg" />
        )}

        {uploading ? (
          <div className="flex flex-col items-center gap-2 w-full px-4">
            <span className="text-sm" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>
              جاري الرفع... {progress}%
            </span>
            <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "hsl(30,12%,88%)" }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: ACCENT }}
              />
            </div>
          </div>
        ) : (
          <span className="text-sm text-center px-3" style={{ color: "hsl(20,8%,55%)", fontFamily: FONT_B }}>
            {value ? "اضغط لتغيير الصورة" : "اضغط لرفع الصورة"}
          </span>
        )}

        {value && !uploading && (
          <button
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="text-xs px-3 py-1 rounded-lg hover:opacity-75 transition-opacity"
            style={{ backgroundColor: "hsl(30,10%,90%)", color: "hsl(20,8%,40%)", fontFamily: FONT_B }}
          >
            حذف
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs mt-0.5" style={{ color: "hsl(0,72%,45%)", fontFamily: FONT_B }}>
          ⚠️ {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
