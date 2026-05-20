import { useState, useEffect } from "react";
import { ref, onValue, push, set, remove, update } from "firebase/database";
import { db } from "../lib/firebase";

export interface Announcement {
  id: string;
  title: string;
  text: string;
  imageData: string;
  active: boolean;
  createdAt: number;
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = ref(db, "announcements");
    const unsub = onValue(r, (snap) => {
      const data = snap.val();
      if (!data) { setAnnouncements([]); setLoading(false); return; }
      const list: Announcement[] = Object.entries(data).map(([id, val]) => ({ id, ...(val as object) } as Announcement));
      list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      setAnnouncements(list);
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  async function addAnnouncement(data: Omit<Announcement, "id" | "createdAt">) {
    const newRef = push(ref(db, "announcements"));
    await set(newRef, { ...data, createdAt: Date.now() });
    return newRef.key!;
  }

  async function updateAnnouncement(id: string, data: Partial<Omit<Announcement, "id" | "createdAt">>) {
    await update(ref(db, `announcements/${id}`), data);
  }

  async function deleteAnnouncement(id: string) {
    await remove(ref(db, `announcements/${id}`));
  }

  const active = announcements.filter((a) => a.active);
  return { announcements, active, loading, addAnnouncement, updateAnnouncement, deleteAnnouncement };
}
