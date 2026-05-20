import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  setDoc,
  increment,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const SESSION_KEY = "shaml_visited";

export function useVisitors() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!db) return;

    let unsub: (() => void) | undefined;

    try {
      unsub = onSnapshot(
        doc(db, "settings", "visitors"),
        (snap) => {
          if (snap.exists()) {
            setCount(snap.data().count ?? 0);
          }
        },
        () => { /* ignore offline errors */ }
      );
    } catch {
      // Firebase not yet configured
    }

    async function trackVisit() {
      if (!db) return;
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
      try {
        const ref = doc(db, "settings", "visitors");
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, { count: 1 });
        } else {
          await setDoc(ref, { count: increment(1) }, { merge: true });
        }
      } catch {
        // Firebase not yet configured
      }
    }

    trackVisit();
    return () => unsub?.();
  }, []);

  return count;
}
