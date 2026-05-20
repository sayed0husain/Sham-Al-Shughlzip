import { useState, useEffect } from "react";
import { ref, onValue, push, set, remove, update } from "firebase/database";
import { db } from "../lib/firebase";

export interface Worker {
  id: string;
  name: string;
  role: string;
  emoji: string;
  email: string;
  isAdmin: boolean;
  percentage: number;
  createdAt: number;
}

export function useWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = ref(db, "workers");
    const unsub = onValue(r, (snap) => {
      const data = snap.val();
      if (!data) { setWorkers([]); setLoading(false); return; }
      const list: Worker[] = Object.entries(data).map(([id, val]) => ({ id, ...(val as object) } as Worker));
      list.sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
      setWorkers(list);
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  async function addWorker(data: Omit<Worker, "id" | "createdAt">) {
    const newRef = push(ref(db, "workers"));
    await set(newRef, { ...data, createdAt: Date.now() });
    return newRef.key!;
  }

  async function updateWorker(id: string, data: Partial<Omit<Worker, "id" | "createdAt">>) {
    await update(ref(db, `workers/${id}`), data);
  }

  async function deleteWorker(id: string) {
    await remove(ref(db, `workers/${id}`));
  }

  return { workers, loading, addWorker, updateWorker, deleteWorker };
}
