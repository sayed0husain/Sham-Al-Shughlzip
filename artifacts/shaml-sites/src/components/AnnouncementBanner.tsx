import { useState } from "react";
import { type Announcement } from "../hooks/useAnnouncements";

interface Props {
  announcements: Announcement[];
}

export function AnnouncementBanner({ announcements }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const visible = announcements.filter((a) => !dismissed.has(a.id));

  if (!visible.length) return null;

  const current = visible[0];

  return (
    <div className="relative bg-primary text-primary-foreground px-4 py-2.5 flex items-center gap-3 text-sm shadow-sm">
      {current.imageData && (
        <img src={current.imageData} alt="" className="h-7 w-7 rounded-md object-cover flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        {current.title && <span className="font-semibold ml-1">{current.title}:</span>}
        <span className="opacity-90">{current.text}</span>
      </div>
      <button
        onClick={() => setDismissed((d) => new Set([...d, current.id]))}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity text-base leading-none mr-1"
        aria-label="إغلاق"
      >
        ✕
      </button>
    </div>
  );
}
