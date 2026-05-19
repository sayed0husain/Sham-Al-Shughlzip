import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Announcement {
  id: string;
  text: string;
  imageData: string;
  active: boolean;
  createdAt: Timestamp | null;
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement)));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  async function addAnnouncement(data: Omit<Announcement, "id" | "createdAt">) {
    return addDoc(collection(db, "announcements"), { ...data, createdAt: serverTimestamp() });
  }

  async function updateAnnouncement(id: string, data: Partial<Omit<Announcement, "id" | "createdAt">>) {
    return updateDoc(doc(db, "announcements", id), data);
  }

  async function deleteAnnouncement(id: string) {
    return deleteDoc(doc(db, "announcements", id));
  }

  const active = announcements.filter((a) => a.active);

  return { announcements, active, loading, addAnnouncement, updateAnnouncement, deleteAnnouncement };
}
