import { useState, useEffect, useRef } from "react";
import { ref, onValue, runTransaction, increment, set, get } from "firebase/database";
import { db } from "../lib/firebase";

export interface SiteStats {
  totalVisitors: number;
  totalUsers: number;
  totalOperations: number;
  totalAnnouncements: number;
  totalWorkers: number;
}

export function useStats() {
  const [stats, setStats] = useState<SiteStats>({ totalVisitors: 0, totalUsers: 0, totalOperations: 0, totalAnnouncements: 0, totalWorkers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = ref(db, "stats");
    const unsub = onValue(r, (snap) => {
      const data = snap.val() ?? {};
      setStats({
        totalVisitors: data.totalVisitors ?? 0,
        totalUsers: data.totalUsers ?? 0,
        totalOperations: data.totalOperations ?? 0,
        totalAnnouncements: data.totalAnnouncements ?? 0,
        totalWorkers: data.totalWorkers ?? 0,
      });
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  return { stats, loading };
}

export async function recordVisit() {
  const sessionKey = "shaml_sites_visited";
  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, "1");
  try {
    await runTransaction(ref(db, "stats/totalVisitors"), (v) => (v ?? 0) + 1);
  } catch { /* silent */ }
}

export async function incrementStat(key: keyof Omit<SiteStats, "totalVisitors">, delta: number = 1) {
  try {
    await runTransaction(ref(db, `stats/${key}`), (v) => Math.max(0, (v ?? 0) + delta));
  } catch { /* silent */ }
}
