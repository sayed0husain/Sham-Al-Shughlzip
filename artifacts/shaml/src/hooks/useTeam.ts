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

export interface TeamMember {
  id: string;
  name: string;
  contact: string;
  contribution: string;
  createdAt: Timestamp | null;
}

export function useTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "team"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TeamMember)));
        setLoading(false);
      },
      () => { setLoading(false); }
    );
    return unsub;
  }, []);

  async function addMember(data: Omit<TeamMember, "id" | "createdAt">): Promise<string> {
    const ref = await addDoc(collection(db, "team"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  }

  async function deleteMember(id: string): Promise<void> {
    await deleteDoc(doc(db, "team", id));
  }

  return { members, loading, addMember, deleteMember };
}
