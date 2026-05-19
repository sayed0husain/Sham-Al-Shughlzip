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
    const unsub = onSnapshot(q, (snap) => {
      setStatements(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Statement)));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  async function addStatement(data: Omit<Statement, "id" | "createdAt">) {
    return addDoc(collection(db, "statements"), { ...data, createdAt: serverTimestamp() });
  }

  async function updateStatement(id: string, data: Partial<Omit<Statement, "id" | "createdAt">>) {
    return updateDoc(doc(db, "statements", id), data);
  }

  async function deleteStatement(id: string) {
    return deleteDoc(doc(db, "statements", id));
  }

  return { statements, loading, addStatement, updateStatement, deleteStatement };
}
