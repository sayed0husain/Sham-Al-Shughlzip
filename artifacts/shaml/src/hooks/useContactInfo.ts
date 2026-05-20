import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface ContactInfo {
  whatsapp: string;
  instagram: string;
  email: string;
}

const DEFAULT_CONTACT: ContactInfo = {
  whatsapp: "",
  instagram: "",
  email: "",
};

export function useContactInfo() {
  const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(
      doc(db, "settings", "contact"),
      (snap) => {
        if (snap.exists()) {
          setContact(snap.data() as ContactInfo);
        }
        setLoading(false);
      },
      () => { setLoading(false); /* ignore offline errors */ }
    );
    return unsub;
  }, []);

  async function updateContact(data: ContactInfo) {
    if (!db) throw new Error("Firebase not configured");
    await setDoc(doc(db, "settings", "contact"), data);
  }

  return { contact, loading, updateContact };
}
