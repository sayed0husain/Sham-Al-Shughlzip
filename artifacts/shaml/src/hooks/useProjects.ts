import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Project {
  id: string;
  type: "لعبة" | "موقع";
  name: string;
  description: string;
  emoji: string;
  emojiDescription: string;
  bgImageUrl: string;
  centerImageUrl: string;
  projectUrl: string;
  createdAt: Timestamp | null;
}

export function useProjects(type?: "لعبة" | "موقع") {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = type
      ? query(collection(db, "projects"), where("type", "==", type), orderBy("createdAt", "desc"))
      : query(collection(db, "projects"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project)));
        setLoading(false);
      },
      () => { setLoading(false); }
    );
    return unsub;
  }, [type]);

  async function addProject(data: Omit<Project, "id" | "createdAt">): Promise<string> {
    const ref = await addDoc(collection(db, "projects"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  }

  async function deleteProject(id: string): Promise<void> {
    await deleteDoc(doc(db, "projects", id));
  }

  return { projects, loading, addProject, deleteProject };
}
