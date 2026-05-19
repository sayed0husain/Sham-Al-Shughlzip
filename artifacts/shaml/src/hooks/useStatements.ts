import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Statement {
  id: string;
  title: string;
  content: string;
  imageUrls: string[];
  createdAt: Timestamp | null;
}

export function useStatements() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "statements"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setStatements(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Statement)));
        setLoading(false);
      },
      () => { setLoading(false); }
    );
    return unsub;
  }, []);

  async function addStatement(data: Omit<Statement, "id" | "createdAt">): Promise<string> {
    const ref = await addDoc(collection(db, "statements"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  }

  async function deleteStatement(id: string): Promise<void> {
    await deleteDoc(doc(db, "statements", id));
  }

  return { statements, loading, addStatement, deleteStatement };
}
