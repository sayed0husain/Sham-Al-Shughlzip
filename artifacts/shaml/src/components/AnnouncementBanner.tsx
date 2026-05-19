import { useState } from "react";
import type { Announcement } from "../hooks/useAnnouncements";

const FONT_H = "'Zaatar','Reem Kufi',sans-serif";
const FONT_B = "'Tajawal','Arial',sans-serif";
const ACCENT = "hsl(8, 61%, 41%)";

interface Props {
  announcements: Announcement[];
}

export default function AnnouncementBanner({ announcements }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = announcements.filter((a) => a.active && !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-3 px-4 py-4" style={{ backgroundColor: "hsl(30,12%,93%)", borderBottom: "1px solid hsl(30,12%,86%)" }}>
      {visible.map((ann) => (
        <div key={ann.id} className="relative max-w-3xl mx-auto w-full rounded-2xl overflow-hidden"
          style={{ backgroundColor: "hsl(30,10%,89%)", border: "1px solid hsl(30,12%,82%)" }}>

          {/* Close button */}
          <button
            onClick={() => setDismissed((prev) => new Set([...prev, ann.id]))}
            className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: "hsl(0,72%,51%)", color: "#fff" }}
            aria-label="إغلاق"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="1" y1="1" x2="11" y2="11" /><line x1="11" y1="1" x2="1" y2="11" />
            </svg>
          </button>

          {/* "إعلان" header */}
          <div className="flex items-center justify-center px-5 pt-4 pb-2">
            <span className="text-base font-bold tracking-widest" style={{ fontFamily: FONT_H, color: ACCENT, letterSpacing: "0.15em" }}>
              إعلان
            </span>
          </div>

          {/* Image area */}
          {ann.imageData ? (
            <div className="px-5 pb-3">
              <img src={ann.imageData} alt="إعلان" className="w-full rounded-xl object-cover max-h-64" />
            </div>
          ) : (
            <div className="mx-5 mb-3 rounded-xl flex items-center justify-center" style={{ backgroundColor: "hsl(30,10%,82%)", minHeight: 80 }}>
              <span style={{ fontFamily: FONT_B, color: "hsl(20,8%,60%)", fontSize: "0.85rem" }}>لا توجد صورة</span>
            </div>
          )}

          {/* Description text */}
          {ann.text && (
            <div className="px-5 pb-4 text-center">
              <p style={{ fontFamily: FONT_B, color: "hsl(20,10%,25%)", fontSize: "0.95rem", lineHeight: 1.7 }}>{ann.text}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
