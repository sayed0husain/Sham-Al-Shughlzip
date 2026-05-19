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

export interface TeamMember {
  id: string;
  name: string;
  contact: string;
  contribution: string;
  emoji: string;
  emojiDescription: string;
  createdAt: Timestamp | null;
}

export function useTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "team"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TeamMember)));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  async function addMember(data: Omit<TeamMember, "id" | "createdAt">) {
    return addDoc(collection(db, "team"), { ...data, createdAt: serverTimestamp() });
  }

  async function updateMember(id: string, data: Partial<Omit<TeamMember, "id" | "createdAt">>) {
    return updateDoc(doc(db, "team", id), data);
  }

  async function deleteMember(id: string) {
    return deleteDoc(doc(db, "team", id));
  }

  return { members, loading, addMember, updateMember, deleteMember };
}
