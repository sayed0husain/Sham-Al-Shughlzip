import { useState, useEffect } from "react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  increment,
  query,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface ProjectClick {
  projectId: string;
  projectName: string;
  clicks: number;
}

export function useAnalytics() {
  const [stats, setStats] = useState<ProjectClick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "analytics"));
    const unsub = onSnapshot(q, (snap) => {
      setStats(snap.docs.map((d) => ({ projectId: d.id, ...d.data() } as ProjectClick)));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  async function recordClick(projectId: string, projectName: string) {
    if (!db) return;
    const ref = doc(db, "analytics", projectId);
    await setDoc(ref, { projectName, clicks: increment(1) }, { merge: true });
  }

  return { stats, loading, recordClick };
}
