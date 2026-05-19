import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "../hooks/useAuth";
import { useContactInfo } from "../hooks/useContactInfo";
import { useProjects } from "../hooks/useProjects";
import ImageUpload from "../components/ImageUpload";

const ACCENT = "hsl(8, 61%, 41%)";
const FONT_H = "'Zaatar','Reem Kufi',sans-serif";
const FONT_B = "'Tajawal',sans-serif";

function InputField({
  label, value, onChange, placeholder = "", type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium" style={{ fontFamily: FONT_H, color: "hsl(20,10%,25%)" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
        style={{
          fontFamily: FONT_B,
          borderColor: "hsl(30,12%,82%)",
          backgroundColor: "hsl(30,20%,98%)",
          color: "hsl(20,10%,15%)",
        }}
        onFocus={(e) => (e.target.style.borderColor = ACCENT)}
        onBlur={(e) => (e.target.style.borderColor = "hsl(30,12%,82%)")}
      />
    </div>
  );
}

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const { contact, updateContact } = useContactInfo();
  const { addProject } = useProjects();

  const [contactForm, setContactForm] = useState({ whatsapp: "", instagram: "", email: "" });
  const [contactSaved, setContactSaved] = useState(false);

  const [form, setForm] = useState({
    type: "لعبة" as "لعبة" | "موقع",
    name: "",
    description: "",
    emoji: "",
    emojiDescription: "",
    bgImageUrl: "",
    centerImageUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>
        جاري التحميل...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
        <h2 style={{ fontFamily: FONT_H, color: ACCENT, fontSize: "1.8rem" }}>غير مصرح</h2>
        <p style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>هذه الصفحة متاحة للمشرف فقط.</p>
        <Link href="/" style={{ color: ACCENT, fontFamily: FONT_H }}>العودة للرئيسية</Link>
      </div>
    );
  }

  async function saveContact() {
    await updateContact({
      whatsapp: contactForm.whatsapp || contact.whatsapp,
      instagram: contactForm.instagram || contact.instagram,
      email: contactForm.email || contact.email,
    });
    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 2500);
  }

  async function handleAddProject(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.description) return;
    setSaving(true);
    await addProject(form);
    setForm({ type: "لعبة", name: "", description: "", emoji: "", emojiDescription: "", bgImageUrl: "", centerImageUrl: "" });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const cardStyle = {
    backgroundColor: "hsl(0,0%,100%)",
    borderRadius: "1.25rem",
    border: "1px solid hsl(30,12%,88%)",
    padding: "1.75rem",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto px-5 py-10 w-full flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 style={{ fontFamily: FONT_H, color: ACCENT, fontSize: "2rem" }}>لوحة التحكم</h1>
        <Link href="/" className="text-sm hover:opacity-70 transition-opacity" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>
          ← الرئيسية
        </Link>
      </div>

      {/* Contact info */}
      <section style={cardStyle}>
        <h2 className="text-xl font-bold mb-5" style={{ fontFamily: FONT_H, color: "hsl(20,10%,15%)" }}>
          معلومات التواصل
        </h2>
        <div className="flex flex-col gap-4">
          <InputField
            label="رقم واتساب"
            value={contactForm.whatsapp || contact.whatsapp}
            onChange={(v) => setContactForm((f) => ({ ...f, whatsapp: v }))}
            placeholder="966XXXXXXXXX+"
          />
          <InputField
            label="رابط إنستقرام"
            value={contactForm.instagram || contact.instagram}
            onChange={(v) => setContactForm((f) => ({ ...f, instagram: v }))}
            placeholder="https://instagram.com/..."
          />
          <InputField
            label="البريد الإلكتروني"
            value={contactForm.email || contact.email}
            onChange={(v) => setContactForm((f) => ({ ...f, email: v }))}
            placeholder="info@shaml.com"
            type="email"
          />
          <button
            onClick={saveContact}
            className="self-start px-6 py-2.5 rounded-xl font-medium transition-all hover:opacity-85"
            style={{ backgroundColor: ACCENT, color: "#fff", fontFamily: FONT_H }}
          >
            {contactSaved ? "✓ تم الحفظ" : "حفظ التغييرات"}
          </button>
        </div>
      </section>

      {/* Add project */}
      <section style={cardStyle}>
        <h2 className="text-xl font-bold mb-5" style={{ fontFamily: FONT_H, color: "hsl(20,10%,15%)" }}>
          إضافة مشروع جديد
        </h2>
        <form onSubmit={handleAddProject} className="flex flex-col gap-4">
          {/* Type select */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ fontFamily: FONT_H, color: "hsl(20,10%,25%)" }}>
              نوع المشروع
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "لعبة" | "موقع" }))}
              className="px-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{ fontFamily: FONT_H, borderColor: "hsl(30,12%,82%)", backgroundColor: "hsl(30,20%,98%)", color: "hsl(20,10%,15%)" }}
            >
              <option value="لعبة">لعبة</option>
              <option value="موقع">موقع</option>
            </select>
          </div>

          <InputField
            label="اسم المشروع"
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            placeholder="اكتب اسم المشروع..."
          />
          <InputField
            label="شرح المشروع"
            value={form.description}
            onChange={(v) => setForm((f) => ({ ...f, description: v }))}
            placeholder="وصف قصير عن المشروع..."
          />

          {/* Emoji row */}
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="الأيموجي"
              value={form.emoji}
              onChange={(v) => setForm((f) => ({ ...f, emoji: v }))}
              placeholder="🎮"
            />
            <InputField
              label="شرح الأيموجي"
              value={form.emojiDescription}
              onChange={(v) => setForm((f) => ({ ...f, emojiDescription: v }))}
              placeholder="نص يظهر عند الضغط..."
            />
          </div>

          {/* Image uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUpload
              label="صورة الخلفية"
              value={form.bgImageUrl}
              onChange={(url) => setForm((f) => ({ ...f, bgImageUrl: url }))}
            />
            <ImageUpload
              label="صورة الموقع المفرغة (PNG)"
              value={form.centerImageUrl}
              onChange={(url) => setForm((f) => ({ ...f, centerImageUrl: url }))}
              accept="image/png"
            />
          </div>

          <button
            type="submit"
            disabled={saving || !form.name}
            className="self-start px-8 py-2.5 rounded-xl font-medium transition-all hover:opacity-85 disabled:opacity-50"
            style={{ backgroundColor: ACCENT, color: "#fff", fontFamily: FONT_H }}
          >
            {saving ? "جاري الإضافة..." : saved ? "✓ تمت الإضافة" : "إضافة المشروع"}
          </button>
        </form>
      </section>
    </div>
  );
}
