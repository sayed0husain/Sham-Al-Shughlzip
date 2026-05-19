import { useState } from "react";
import { Link } from "wouter";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { useContactInfo } from "../hooks/useContactInfo";
import { useProjects } from "../hooks/useProjects";
import { useStatements } from "../hooks/useStatements";
import { useTeam } from "../hooks/useTeam";
import ImageUpload from "../components/ImageUpload";
import MultiImageUpload from "../components/MultiImageUpload";

const ACCENT = "hsl(8, 61%, 41%)";
const ACCENT_LIGHT = "hsl(8,61%,96%)";
const FONT_H = "'Zaatar','Reem Kufi',sans-serif";
const FONT_B = "'Tajawal',sans-serif";

/* ─── tiny helpers ─────────────────────────────────────── */
type Tab = "projects" | "statements" | "team" | "contact";

function Field({
  label, value, onChange, placeholder = "", type = "text",
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
        style={{ fontFamily: FONT_B, borderColor: "hsl(30,12%,82%)", backgroundColor: "#fff", color: "hsl(20,10%,15%)" }}
        onFocus={(e) => (e.target.style.borderColor = ACCENT)}
        onBlur={(e) => (e.target.style.borderColor = "hsl(30,12%,82%)")}
      />
    </div>
  );
}

function TextArea({
  label, value, onChange, placeholder = "", rows = 4, hint,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; hint?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all resize-y"
        style={{ fontFamily: FONT_B, borderColor: "hsl(30,12%,82%)", backgroundColor: "#fff", color: "hsl(20,10%,15%)" }}
        onFocus={(e) => (e.target.style.borderColor = ACCENT)}
        onBlur={(e) => (e.target.style.borderColor = "hsl(30,12%,82%)")}
      />
      {hint && <p className="text-xs" style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)" }}>{hint}</p>}
    </div>
  );
}

function Btn({ children, onClick, disabled, color = ACCENT, type = "button" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; color?: string; type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ backgroundColor: color, color: "#fff", fontFamily: FONT_H }}
    >
      {children}
    </button>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-4 rounded-2xl" style={{ backgroundColor: color }}>
      <span className="text-2xl font-bold" style={{ fontFamily: "'Inter','Arial',sans-serif", color: "hsl(20,10%,12%)" }}>{value}</span>
      <span className="text-xs font-medium" style={{ fontFamily: FONT_B, color: "hsl(20,8%,45%)" }}>{label}</span>
    </div>
  );
}

/* ─── Login screen ─────────────────────────────────────── */
function LoginScreen({ loading }: { loading: boolean }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function login() {
    setBusy(true); setErr("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      try {
        const { signInWithRedirect } = await import("firebase/auth");
        await signInWithRedirect(auth, googleProvider);
      } catch (e2: unknown) {
        setErr((e2 as { message?: string }).message ?? "فشل تسجيل الدخول");
        setBusy(false);
      }
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-3 p-10 rounded-3xl" style={{ backgroundColor: "hsl(0,0%,100%)", border: "1px solid hsl(30,12%,88%)", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", maxWidth: 360, width: "100%" }}>
        <img src="/logo.png" alt="شمل" className="w-16 h-16 rounded-2xl" />
        <h2 className="text-2xl font-bold" style={{ fontFamily: FONT_H, color: ACCENT }}>لوحة تحكم شمل</h2>
        <p className="text-sm text-center" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>يجب تسجيل الدخول بحساب المشرف للمتابعة</p>
        {err && <p className="text-xs text-center" style={{ color: "hsl(0,72%,45%)", fontFamily: FONT_B }}>⚠️ {err}</p>}
        <button
          onClick={login}
          disabled={busy}
          className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-md disabled:opacity-50"
          style={{ backgroundColor: "#fff", border: "1.5px solid hsl(30,12%,82%)", color: "hsl(20,10%,20%)", fontFamily: FONT_B }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {busy ? "جاري الدخول..." : "تسجيل الدخول عبر Google"}
        </button>
      </div>
    </div>
  );
}

/* ─── Projects tab ─────────────────────────────────────── */
const EMPTY_PROJECT = { type: "لعبة" as "لعبة" | "موقع", name: "", description: "", emoji: "", emojiDescription: "", bgImageUrl: "", centerImageUrl: "", projectUrl: "" };

function ProjectsTab() {
  const { projects, addProject, deleteProject } = useProjects();
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await addProject(form);
      setForm(EMPTY_PROJECT);
      setOk(true);
      setTimeout(() => setOk(false), 3000);
    } catch (err: unknown) {
      alert("خطأ في الحفظ: " + (err as { message?: string }).message);
    } finally {
      setSaving(false);
    }
  }

  async function del(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;
    setDeletingId(id);
    try { await deleteProject(id); } finally { setDeletingId(null); }
  }

  const set = (k: keyof typeof EMPTY_PROJECT) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="flex flex-col gap-6">
      {/* Existing projects table */}
      {projects.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(30,12%,88%)" }}>
          <div className="px-5 py-3.5" style={{ backgroundColor: "hsl(30,10%,96%)", borderBottom: "1px solid hsl(30,12%,88%)" }}>
            <h3 className="font-semibold text-sm" style={{ fontFamily: FONT_H, color: "hsl(20,10%,20%)" }}>المشاريع المنشورة ({projects.length})</h3>
          </div>
          <div className="divide-y" style={{ divideColor: "hsl(30,12%,92%)" }}>
            {projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3 gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {p.bgImageUrl && <img src={p.bgImageUrl} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />}
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm truncate" style={{ fontFamily: FONT_H, color: "hsl(20,10%,15%)" }}>{p.name}</span>
                    <span className="text-xs truncate" style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)" }}>{p.type} {p.projectUrl ? "· " + p.projectUrl : ""}</span>
                  </div>
                </div>
                <button
                  onClick={() => del(p.id)}
                  disabled={deletingId === p.id}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80 disabled:opacity-40"
                  style={{ backgroundColor: "hsl(0,72%,95%)", color: "hsl(0,72%,40%)", fontFamily: FONT_B }}
                >
                  {deletingId === p.id ? "..." : "حذف"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add form */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ backgroundColor: "#fff", border: "1px solid hsl(30,12%,88%)" }}>
        <h3 className="font-bold text-base" style={{ fontFamily: FONT_H, color: "hsl(20,10%,15%)" }}>إضافة مشروع جديد</h3>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>نوع المشروع</label>
            <div className="flex gap-2">
              {(["لعبة", "موقع"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold border transition-all"
                  style={{ backgroundColor: form.type === t ? ACCENT : "#fff", color: form.type === t ? "#fff" : "hsl(20,10%,35%)", borderColor: form.type === t ? ACCENT : "hsl(30,12%,82%)", fontFamily: FONT_H }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="اسم المشروع *" value={form.name} onChange={set("name")} placeholder="اسم المشروع..." />
            <Field label="رابط المشروع *" value={form.projectUrl} onChange={set("projectUrl")} placeholder="https://..." type="url" />
          </div>
          <Field label="شرح المشروع" value={form.description} onChange={set("description")} placeholder="وصف قصير..." />
          <div className="grid grid-cols-2 gap-3">
            <Field label="الأيموجي" value={form.emoji} onChange={set("emoji")} placeholder="🎮" />
            <Field label="شرح الأيموجي" value={form.emojiDescription} onChange={set("emojiDescription")} placeholder="نص يظهر عند الضغط..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUpload label="صورة الخلفية" value={form.bgImageUrl} onChange={(url) => setForm((f) => ({ ...f, bgImageUrl: url }))} />
            <ImageUpload label="صورة اللوجو (PNG شفاف)" value={form.centerImageUrl} onChange={(url) => setForm((f) => ({ ...f, centerImageUrl: url }))} accept="image/png" />
          </div>
          <div className="flex items-center gap-3">
            <Btn type="submit" disabled={saving || !form.name.trim()}>
              {saving ? "جاري الحفظ..." : ok ? "✓ تمت الإضافة!" : "إضافة المشروع"}
            </Btn>
            {ok && <span className="text-sm" style={{ color: "hsl(142,72%,35%)", fontFamily: FONT_B }}>تمت إضافة المشروع بنجاح ✓</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Statements tab ───────────────────────────────────── */
const EMPTY_STMT = { title: "", content: "", imageUrls: [] as string[] };

function StatementsTab() {
  const { statements, addStatement, deleteStatement } = useStatements();
  const [form, setForm] = useState(EMPTY_STMT);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      await addStatement(form);
      setForm(EMPTY_STMT);
      setOk(true);
      setTimeout(() => setOk(false), 3000);
    } catch (err: unknown) {
      alert("خطأ في الحفظ: " + (err as { message?: string }).message);
    } finally {
      setSaving(false);
    }
  }

  async function del(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا التصريح؟")) return;
    setDeletingId(id);
    try { await deleteStatement(id); } finally { setDeletingId(null); }
  }

  return (
    <div className="flex flex-col gap-6">
      {statements.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(30,12%,88%)" }}>
          <div className="px-5 py-3.5" style={{ backgroundColor: "hsl(30,10%,96%)", borderBottom: "1px solid hsl(30,12%,88%)" }}>
            <h3 className="font-semibold text-sm" style={{ fontFamily: FONT_H, color: "hsl(20,10%,20%)" }}>التصريحات المنشورة ({statements.length})</h3>
          </div>
          <div className="divide-y">
            {statements.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3 gap-4">
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-sm truncate" style={{ fontFamily: FONT_H, color: "hsl(20,10%,15%)" }}>{s.title}</span>
                  <span className="text-xs truncate" style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)" }}>{s.content.slice(0, 60)}...</span>
                </div>
                <button onClick={() => del(s.id)} disabled={deletingId === s.id}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80 disabled:opacity-40"
                  style={{ backgroundColor: "hsl(0,72%,95%)", color: "hsl(0,72%,40%)", fontFamily: FONT_B }}>
                  {deletingId === s.id ? "..." : "حذف"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ backgroundColor: "#fff", border: "1px solid hsl(30,12%,88%)" }}>
        <h3 className="font-bold text-base" style={{ fontFamily: FONT_H, color: "hsl(20,10%,15%)" }}>إضافة تصريح جديد</h3>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="عنوان التصريح *" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} placeholder="عنوان التصريح..." />
          <TextArea
            label="التصريح *"
            value={form.content}
            onChange={(v) => setForm((f) => ({ ...f, content: v }))}
            placeholder={"# عنوان فرعي\nنص التصريح...\nكلمة شمل تُعرض تلقائياً بخط مميز\n% يتحول لقائمة مشاريع تفاعلية"}
            rows={6}
            hint="# في بداية السطر = عنوان | شمل = خط Zaatar | % = قائمة مشاريع"
          />
          <MultiImageUpload
            label="رفع صور للتصريح"
            values={form.imageUrls}
            onChange={(urls) => setForm((f) => ({ ...f, imageUrls: urls }))}
          />
          <div className="flex items-center gap-3">
            <Btn type="submit" disabled={saving || !form.title.trim() || !form.content.trim()}>
              {saving ? "جاري النشر..." : ok ? "✓ تم النشر!" : "نشر التصريح"}
            </Btn>
            {ok && <span className="text-sm" style={{ color: "hsl(142,72%,35%)", fontFamily: FONT_B }}>تم نشر التصريح بنجاح ✓</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Team tab ─────────────────────────────────────────── */
const EMPTY_MEMBER = { name: "", contact: "", contribution: "" };

function TeamTab() {
  const { members, addMember, deleteMember } = useTeam();
  const [form, setForm] = useState(EMPTY_MEMBER);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.contribution.trim()) return;
    setSaving(true);
    try {
      await addMember(form);
      setForm(EMPTY_MEMBER);
      setOk(true);
      setTimeout(() => setOk(false), 3000);
    } catch (err: unknown) {
      alert("خطأ في الحفظ: " + (err as { message?: string }).message);
    } finally {
      setSaving(false);
    }
  }

  async function del(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا العضو؟")) return;
    setDeletingId(id);
    try { await deleteMember(id); } finally { setDeletingId(null); }
  }

  return (
    <div className="flex flex-col gap-6">
      {members.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(30,12%,88%)" }}>
          <div className="px-5 py-3.5" style={{ backgroundColor: "hsl(30,10%,96%)", borderBottom: "1px solid hsl(30,12%,88%)" }}>
            <h3 className="font-semibold text-sm" style={{ fontFamily: FONT_H, color: "hsl(20,10%,20%)" }}>أعضاء الأيادي العاملة ({members.length})</h3>
          </div>
          <div className="divide-y">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between px-5 py-3 gap-4">
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-sm truncate" style={{ fontFamily: FONT_B, color: "hsl(20,10%,15%)" }}>{m.name}</span>
                  <span className="text-xs truncate" style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)" }}>{m.contribution}</span>
                </div>
                <button onClick={() => del(m.id)} disabled={deletingId === m.id}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80 disabled:opacity-40"
                  style={{ backgroundColor: "hsl(0,72%,95%)", color: "hsl(0,72%,40%)", fontFamily: FONT_B }}>
                  {deletingId === m.id ? "..." : "حذف"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ backgroundColor: "#fff", border: "1px solid hsl(30,12%,88%)" }}>
        <h3 className="font-bold text-base" style={{ fontFamily: FONT_H, color: "hsl(20,10%,15%)" }}>إضافة عضو في الأيادي العاملة</h3>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="الاسم *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="الاسم الكامل..." />
            <Field label="الإنستقرام أو البريد (اختياري)" value={form.contact} onChange={(v) => setForm((f) => ({ ...f, contact: v }))} placeholder="@handle أو email..." />
          </div>
          <Field label="المساهمة *" value={form.contribution} onChange={(v) => setForm((f) => ({ ...f, contribution: v }))} placeholder="وصف دور العضو ومساهمته..." />
          <div className="flex items-center gap-3">
            <Btn type="submit" disabled={saving || !form.name.trim() || !form.contribution.trim()}>
              {saving ? "جاري الإضافة..." : ok ? "✓ تمت الإضافة!" : "إضافة العضو"}
            </Btn>
            {ok && <span className="text-sm" style={{ color: "hsl(142,72%,35%)", fontFamily: FONT_B }}>تمت الإضافة بنجاح ✓</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Contact tab ──────────────────────────────────────── */
function ContactTab() {
  const { contact, updateContact } = useContactInfo();
  const [form, setForm] = useState({ whatsapp: "", instagram: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateContact({
        whatsapp: form.whatsapp || contact.whatsapp,
        instagram: form.instagram || contact.instagram,
        email: form.email || contact.email,
      });
      setOk(true);
      setTimeout(() => setOk(false), 3000);
    } catch (err: unknown) {
      alert("خطأ في الحفظ: " + (err as { message?: string }).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ backgroundColor: "#fff", border: "1px solid hsl(30,12%,88%)" }}>
      <h3 className="font-bold text-base" style={{ fontFamily: FONT_H, color: "hsl(20,10%,15%)" }}>معلومات التواصل</h3>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="واتساب (+973...)" value={form.whatsapp || contact.whatsapp} onChange={(v) => setForm((f) => ({ ...f, whatsapp: v }))} placeholder="+97366XXXXXX" />
        <Field label="إنستقرام" value={form.instagram || contact.instagram} onChange={(v) => setForm((f) => ({ ...f, instagram: v }))} placeholder="https://instagram.com/..." />
        <Field label="البريد الإلكتروني" value={form.email || contact.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} placeholder="info@shaml.com" type="email" />
        <div className="flex items-center gap-3">
          <Btn type="submit" disabled={saving}>
            {saving ? "جاري الحفظ..." : ok ? "✓ تم الحفظ!" : "حفظ التغييرات"}
          </Btn>
          {ok && <span className="text-sm" style={{ color: "hsl(142,72%,35%)", fontFamily: FONT_B }}>تم الحفظ بنجاح ✓</span>}
        </div>
      </form>
    </div>
  );
}

/* ─── Main admin page ──────────────────────────────────── */
export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const { projects } = useProjects();
  const { statements } = useStatements();
  const { members } = useTeam();
  const [tab, setTab] = useState<Tab>("projects");

  if (!user || !isAdmin) return <LoginScreen loading={loading} />;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "projects", label: "المشاريع", count: projects.length },
    { id: "statements", label: "التصريحات", count: statements.length },
    { id: "team", label: "الأيادي العاملة", count: members.length },
    { id: "contact", label: "التواصل" },
  ];

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: "hsl(30,15%,96%)", minHeight: "100vh" }}>
      {/* Top bar */}
      <div className="w-full sticky top-[57px] z-30 border-b" style={{ backgroundColor: "hsl(0,0%,100%)", borderColor: "hsl(30,12%,88%)" }}>
        <div className="max-w-4xl mx-auto px-5">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="w-8 h-8 rounded-lg" />
              <h1 className="text-lg font-bold" style={{ fontFamily: FONT_H, color: ACCENT }}>لوحة التحكم</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs hidden sm:block" style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)" }}>{user.email}</span>
              <button
                onClick={() => signOut(auth)}
                className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:bg-gray-50"
                style={{ fontFamily: FONT_B, color: "hsl(20,8%,45%)", borderColor: "hsl(30,12%,85%)" }}
              >
                خروج
              </button>
              <Link href="/" className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:bg-gray-50"
                style={{ fontFamily: FONT_B, color: "hsl(20,8%,45%)", borderColor: "hsl(30,12%,85%)" }}>
                الرئيسية
              </Link>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 pb-0">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all"
                style={{
                  fontFamily: FONT_H,
                  color: tab === t.id ? ACCENT : "hsl(20,8%,50%)",
                  borderBottomColor: tab === t.id ? ACCENT : "transparent",
                  backgroundColor: "transparent",
                }}>
                {t.label}
                {t.count !== undefined && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs"
                    style={{ backgroundColor: tab === t.id ? ACCENT_LIGHT : "hsl(30,10%,92%)", color: tab === t.id ? ACCENT : "hsl(20,8%,50%)", fontFamily: "'Inter','Arial',sans-serif" }}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="w-full" style={{ backgroundColor: "hsl(0,0%,100%)", borderBottom: "1px solid hsl(30,12%,88%)" }}>
        <div className="max-w-4xl mx-auto px-5 py-4 grid grid-cols-3 gap-3">
          <StatPill label="مشاريع" value={projects.length} color="hsl(210,90%,95%)" />
          <StatPill label="تصريحات" value={statements.length} color="hsl(142,50%,94%)" />
          <StatPill label="أيادي عاملة" value={members.length} color={ACCENT_LIGHT} />
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-5 py-6">
        {tab === "projects" && <ProjectsTab />}
        {tab === "statements" && <StatementsTab />}
        {tab === "team" && <TeamTab />}
        {tab === "contact" && <ContactTab />}
      </div>
    </div>
  );
}
