import { useState } from "react";
import { Link } from "wouter";
import { signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { useContactInfo } from "../hooks/useContactInfo";
import { useProjects } from "../hooks/useProjects";
import { useStatements } from "../hooks/useStatements";
import { useTeam } from "../hooks/useTeam";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { useAnalytics } from "../hooks/useAnalytics";
import ImageUpload from "../components/ImageUpload";
import MultiImageUpload from "../components/MultiImageUpload";
import SmartTextarea from "../components/SmartTextarea";

const ACCENT = "hsl(8, 61%, 41%)";
const ACCENT_L = "hsl(8,61%,96%)";
const FONT_H = "'Zaatar','Reem Kufi',sans-serif";
const FONT_B = "'Tajawal',sans-serif";

type Tab = "projects" | "statements" | "team" | "announcements" | "contact" | "analytics";

/* ── Shared UI ─────────────────────────────────────────── */
function Field({ label, value, onChange, placeholder = "", type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
        style={{ fontFamily: FONT_B, borderColor: "hsl(30,12%,82%)", backgroundColor: "#fff", color: "hsl(20,10%,15%)" }}
        onFocus={(e) => (e.target.style.borderColor = ACCENT)}
        onBlur={(e) => (e.target.style.borderColor = "hsl(30,12%,82%)")} />
    </div>
  );
}

function Btn({ children, onClick, disabled, color = ACCENT, variant = "solid", type = "button" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; color?: string; variant?: "solid" | "ghost"; type?: "button" | "submit";
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
      style={variant === "solid"
        ? { backgroundColor: color, color: "#fff", fontFamily: FONT_H }
        : { backgroundColor: "transparent", color, border: `1.5px solid ${color}`, fontFamily: FONT_H }}>
      {children}
    </button>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 rounded-2xl" style={{ backgroundColor: color }}>
      <span className="text-xl font-bold" style={{ fontFamily: "'Inter','Arial',sans-serif", color: "hsl(20,10%,12%)" }}>{value}</span>
      <span className="text-xs" style={{ fontFamily: FONT_B, color: "hsl(20,8%,45%)" }}>{label}</span>
    </div>
  );
}

function RowActions({ onEdit, onDelete, deleting }: { onEdit: () => void; onDelete: () => void; deleting: boolean }) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <button onClick={onEdit}
        className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:bg-gray-50"
        style={{ fontFamily: FONT_B, color: "hsl(20,8%,40%)", borderColor: "hsl(30,12%,82%)" }}>
        تعديل
      </button>
      <button onClick={onDelete} disabled={deleting}
        className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80 disabled:opacity-40"
        style={{ backgroundColor: "hsl(0,72%,95%)", color: "hsl(0,72%,40%)", fontFamily: FONT_B }}>
        {deleting ? "..." : "حذف"}
      </button>
    </div>
  );
}

/* ── Login ─────────────────────────────────────────────── */
function LoginScreen({ loading }: { loading: boolean }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function login(provider: "google" | "apple") {
    setBusy(true); setErr("");
    const prov = provider === "google" ? googleProvider : appleProvider;
    try {
      await signInWithPopup(auth, prov);
    } catch {
      try { await signInWithRedirect(auth, prov); }
      catch (e2: unknown) { setErr((e2 as { message?: string }).message ?? "فشل تسجيل الدخول"); setBusy(false); }
    }
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>جاري التحميل...</div>
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-3 p-10 rounded-3xl"
        style={{ backgroundColor: "#fff", border: "1px solid hsl(30,12%,88%)", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", maxWidth: 360, width: "100%" }}>
        <img src="/logo.png" alt="شمل" className="w-16 h-16 rounded-2xl" />
        <h2 className="text-2xl font-bold" style={{ fontFamily: FONT_H, color: ACCENT }}>لوحة تحكم شمل</h2>
        <p className="text-sm text-center" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>سجّل دخولك بحساب المشرف للمتابعة</p>
        {err && <p className="text-xs text-center" style={{ color: "hsl(0,72%,45%)", fontFamily: FONT_B }}>⚠️ {err}</p>}
        <button onClick={() => login("google")} disabled={busy}
          className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-md disabled:opacity-50"
          style={{ backgroundColor: "#fff", border: "1.5px solid hsl(30,12%,82%)", color: "hsl(20,10%,20%)", fontFamily: FONT_B }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {busy ? "جاري الدخول..." : "تسجيل الدخول عبر Google"}
        </button>
        <button onClick={() => login("apple")} disabled={busy}
          className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-md disabled:opacity-50"
          style={{ backgroundColor: "#000", border: "1.5px solid #000", color: "#fff", fontFamily: FONT_B }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zm3.378-3.066c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/></svg>
          {busy ? "جاري الدخول..." : "تسجيل الدخول عبر Apple"}
        </button>
      </div>
    </div>
  );
}

/* ── Projects Tab ──────────────────────────────────────── */
const EP = { type: "لعبة" as "لعبة" | "موقع", name: "", description: "", emoji: "", emojiDescription: "", bgImageUrl: "", centerImageUrl: "", projectUrl: "" };

function ProjectsTab() {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [form, setForm] = useState(EP);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function startEdit(p: typeof projects[0]) {
    setEditId(p.id);
    setForm({ type: p.type, name: p.name, description: p.description, emoji: p.emoji, emojiDescription: p.emojiDescription, bgImageUrl: p.bgImageUrl, centerImageUrl: p.centerImageUrl, projectUrl: p.projectUrl });
    window.scrollTo({ top: 9999, behavior: "smooth" });
  }

  function cancelEdit() { setEditId(null); setForm(EP); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editId) { await updateProject(editId, form); setEditId(null); }
      else { await addProject(form); }
      setForm(EP); setOk(true); setTimeout(() => setOk(false), 3000);
    } catch (err: unknown) { alert("خطأ: " + (err as { message?: string }).message); }
    finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm("حذف هذا المشروع؟")) return;
    setDeletingId(id);
    try { await deleteProject(id); } finally { setDeletingId(null); }
  }

  const s = (k: keyof typeof EP) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="flex flex-col gap-6">
      {projects.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(30,12%,88%)" }}>
          <div className="px-5 py-3" style={{ backgroundColor: "hsl(30,10%,96%)", borderBottom: "1px solid hsl(30,12%,88%)" }}>
            <span className="text-sm font-semibold" style={{ fontFamily: FONT_H, color: "hsl(20,10%,20%)" }}>المشاريع ({projects.length})</span>
          </div>
          {projects.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-5 py-3 gap-3 border-b last:border-0" style={{ borderColor: "hsl(30,12%,92%)" }}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {p.bgImageUrl && <img src={p.bgImageUrl} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />}
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-sm truncate" style={{ fontFamily: FONT_H }}>{p.emoji} {p.name}</span>
                  <span className="text-xs truncate" style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)" }}>{p.type} · {p.projectUrl || "لا يوجد رابط"}</span>
                </div>
              </div>
              <RowActions onEdit={() => startEdit(p)} onDelete={() => del(p.id)} deleting={deletingId === p.id} />
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ backgroundColor: "#fff", border: `2px solid ${editId ? ACCENT : "hsl(30,12%,88%)"}` }}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base" style={{ fontFamily: FONT_H }}>{editId ? "تعديل المشروع" : "إضافة مشروع جديد"}</h3>
          {editId && <button onClick={cancelEdit} className="text-xs px-3 py-1.5 rounded-lg" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)", backgroundColor: "hsl(30,10%,93%)" }}>إلغاء</button>}
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex gap-2">
            {(["لعبة", "موقع"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setForm((f) => ({ ...f, type: t }))}
                className="flex-1 py-2 rounded-xl text-sm font-semibold border transition-all"
                style={{ backgroundColor: form.type === t ? ACCENT : "#fff", color: form.type === t ? "#fff" : "hsl(20,10%,35%)", borderColor: form.type === t ? ACCENT : "hsl(30,12%,82%)", fontFamily: FONT_H }}>
                {t}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="اسم المشروع *" value={form.name} onChange={s("name")} placeholder="الاسم..." />
            <Field label="رابط المشروع" value={form.projectUrl} onChange={s("projectUrl")} placeholder="https://..." type="url" />
          </div>
          <Field label="الشرح" value={form.description} onChange={s("description")} placeholder="وصف قصير..." />
          <div className="grid grid-cols-2 gap-3">
            <Field label="الأيموجي" value={form.emoji} onChange={s("emoji")} placeholder="🎮" />
            <Field label="شرح الأيموجي" value={form.emojiDescription} onChange={s("emojiDescription")} placeholder="نص التلميح..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUpload label="صورة الخلفية" value={form.bgImageUrl} onChange={(u) => setForm((f) => ({ ...f, bgImageUrl: u }))} />
            <ImageUpload label="لوجو شفاف (PNG)" value={form.centerImageUrl} onChange={(u) => setForm((f) => ({ ...f, centerImageUrl: u }))} accept="image/png" />
          </div>
          <div className="flex items-center gap-3">
            <Btn type="submit" disabled={saving || !form.name.trim()}>
              {saving ? "جاري الحفظ..." : ok ? "✓ تم!" : editId ? "حفظ التعديلات" : "إضافة المشروع"}
            </Btn>
            {ok && <span className="text-sm" style={{ color: "hsl(142,72%,35%)", fontFamily: FONT_B }}>تمت العملية بنجاح ✓</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Statements Tab ────────────────────────────────────── */
const ES = { title: "", content: "", imageUrls: [] as string[] };

function StatementsTab() {
  const { statements, addStatement, updateStatement, deleteStatement } = useStatements();
  const { projects } = useProjects();
  const [form, setForm] = useState(ES);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function startEdit(s: typeof statements[0]) {
    setEditId(s.id);
    setForm({ title: s.title, content: s.content, imageUrls: s.imageUrls ?? [] });
    window.scrollTo({ top: 9999, behavior: "smooth" });
  }

  function cancelEdit() { setEditId(null); setForm(ES); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      if (editId) { await updateStatement(editId, form); setEditId(null); }
      else { await addStatement(form); }
      setForm(ES); setOk(true); setTimeout(() => setOk(false), 3000);
    } catch (err: unknown) { alert("خطأ: " + (err as { message?: string }).message); }
    finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm("حذف هذا التصريح؟")) return;
    setDeletingId(id);
    try { await deleteStatement(id); } finally { setDeletingId(null); }
  }

  return (
    <div className="flex flex-col gap-6">
      {statements.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(30,12%,88%)" }}>
          <div className="px-5 py-3" style={{ backgroundColor: "hsl(30,10%,96%)", borderBottom: "1px solid hsl(30,12%,88%)" }}>
            <span className="text-sm font-semibold" style={{ fontFamily: FONT_H }}>التصريحات ({statements.length})</span>
          </div>
          {statements.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-5 py-3 gap-3 border-b last:border-0" style={{ borderColor: "hsl(30,12%,92%)" }}>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-semibold text-sm truncate" style={{ fontFamily: FONT_H }}>{s.title}</span>
                <span className="text-xs truncate" style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)" }}>{s.content.slice(0, 60)}…</span>
              </div>
              <RowActions onEdit={() => startEdit(s)} onDelete={() => del(s.id)} deleting={deletingId === s.id} />
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ backgroundColor: "#fff", border: `2px solid ${editId ? ACCENT : "hsl(30,12%,88%)"}` }}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base" style={{ fontFamily: FONT_H }}>{editId ? "تعديل التصريح" : "إضافة تصريح جديد"}</h3>
          {editId && <button onClick={cancelEdit} className="text-xs px-3 py-1.5 rounded-lg" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)", backgroundColor: "hsl(30,10%,93%)" }}>إلغاء</button>}
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="عنوان التصريح *" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} placeholder="العنوان..." />
          <SmartTextarea
            value={form.content}
            onChange={(v) => setForm((f) => ({ ...f, content: v }))}
            placeholder={"# عنوان\nنص التصريح... اكتب % لاختيار مشروع"}
            projects={projects}
            hint="# في بداية السطر = عنوان | شمل = خط Zaatar تلقائياً | % = قائمة مشاريع تفاعلية"
          />
          <MultiImageUpload label="صور التصريح" values={form.imageUrls} onChange={(urls) => setForm((f) => ({ ...f, imageUrls: urls }))} />
          <div className="flex items-center gap-3">
            <Btn type="submit" disabled={saving || !form.title.trim() || !form.content.trim()}>
              {saving ? "جاري النشر..." : ok ? "✓ تم!" : editId ? "حفظ التعديلات" : "نشر التصريح"}
            </Btn>
            {ok && <span className="text-sm" style={{ color: "hsl(142,72%,35%)", fontFamily: FONT_B }}>تم بنجاح ✓</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Team Tab ──────────────────────────────────────────── */
const ET = { name: "", contact: "", contribution: "", emoji: "", emojiDescription: "" };

function TeamTab() {
  const { members, addMember, updateMember, deleteMember } = useTeam();
  const [form, setForm] = useState(ET);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function startEdit(m: typeof members[0]) {
    setEditId(m.id);
    setForm({ name: m.name, contact: m.contact, contribution: m.contribution, emoji: m.emoji ?? "", emojiDescription: m.emojiDescription ?? "" });
    window.scrollTo({ top: 9999, behavior: "smooth" });
  }

  function cancelEdit() { setEditId(null); setForm(ET); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.contribution.trim()) return;
    setSaving(true);
    try {
      if (editId) { await updateMember(editId, form); setEditId(null); }
      else { await addMember(form); }
      setForm(ET); setOk(true); setTimeout(() => setOk(false), 3000);
    } catch (err: unknown) { alert("خطأ: " + (err as { message?: string }).message); }
    finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm("حذف هذا العضو؟")) return;
    setDeletingId(id);
    try { await deleteMember(id); } finally { setDeletingId(null); }
  }

  const s = (k: keyof typeof ET) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="flex flex-col gap-6">
      {members.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(30,12%,88%)" }}>
          <div className="px-5 py-3" style={{ backgroundColor: "hsl(30,10%,96%)", borderBottom: "1px solid hsl(30,12%,88%)" }}>
            <span className="text-sm font-semibold" style={{ fontFamily: FONT_H }}>الأعضاء ({members.length})</span>
          </div>
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-5 py-3 gap-3 border-b last:border-0" style={{ borderColor: "hsl(30,12%,92%)" }}>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-semibold text-sm" style={{ fontFamily: FONT_B }}>{m.emoji} {m.name}</span>
                <span className="text-xs truncate" style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)" }}>{m.contribution}</span>
              </div>
              <RowActions onEdit={() => startEdit(m)} onDelete={() => del(m.id)} deleting={deletingId === m.id} />
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ backgroundColor: "#fff", border: `2px solid ${editId ? ACCENT : "hsl(30,12%,88%)"}` }}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base" style={{ fontFamily: FONT_H }}>{editId ? "تعديل بيانات العضو" : "إضافة عضو في الأيادي العاملة"}</h3>
          {editId && <button onClick={cancelEdit} className="text-xs px-3 py-1.5 rounded-lg" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)", backgroundColor: "hsl(30,10%,93%)" }}>إلغاء</button>}
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="الاسم *" value={form.name} onChange={s("name")} placeholder="الاسم الكامل..." />
            <Field label="إنستقرام أو البريد (اختياري)" value={form.contact} onChange={s("contact")} placeholder="@handle أو email" />
          </div>
          <Field label="المساهمة *" value={form.contribution} onChange={s("contribution")} placeholder="وصف دور العضو..." />
          <div className="grid grid-cols-2 gap-3">
            <Field label="إيموجي مرافق" value={form.emoji} onChange={s("emoji")} placeholder="🌟" />
            <Field label="شرح الإيموجي" value={form.emojiDescription} onChange={s("emojiDescription")} placeholder="نص توضيحي..." />
          </div>
          <div className="flex items-center gap-3">
            <Btn type="submit" disabled={saving || !form.name.trim() || !form.contribution.trim()}>
              {saving ? "جاري الحفظ..." : ok ? "✓ تم!" : editId ? "حفظ التعديلات" : "إضافة العضو"}
            </Btn>
            {ok && <span className="text-sm" style={{ color: "hsl(142,72%,35%)", fontFamily: FONT_B }}>تم بنجاح ✓</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Announcements Tab ─────────────────────────────────── */
const EA = { text: "", imageData: "", active: true };

function AnnouncementsTab() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncements();
  const [form, setForm] = useState(EA);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function startEdit(a: typeof announcements[0]) {
    setEditId(a.id);
    setForm({ text: a.text, imageData: a.imageData, active: a.active });
    window.scrollTo({ top: 9999, behavior: "smooth" });
  }
  function cancelEdit() { setEditId(null); setForm(EA); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.text.trim()) return;
    setSaving(true);
    try {
      if (editId) { await updateAnnouncement(editId, form); setEditId(null); }
      else { await addAnnouncement(form); }
      setForm(EA); setOk(true); setTimeout(() => setOk(false), 3000);
    } catch (err: unknown) { alert("خطأ: " + (err as { message?: string }).message); }
    finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm("حذف هذا الإعلان؟")) return;
    setDeletingId(id);
    try { await deleteAnnouncement(id); } finally { setDeletingId(null); }
  }

  async function toggleActive(a: typeof announcements[0]) {
    await updateAnnouncement(a.id, { active: !a.active });
  }

  return (
    <div className="flex flex-col gap-6">
      {announcements.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(30,12%,88%)" }}>
          <div className="px-5 py-3" style={{ backgroundColor: "hsl(30,10%,96%)", borderBottom: "1px solid hsl(30,12%,88%)" }}>
            <span className="text-sm font-semibold" style={{ fontFamily: FONT_H }}>الإعلانات ({announcements.length})</span>
          </div>
          {announcements.map((a) => (
            <div key={a.id} className="flex items-center justify-between px-5 py-3 gap-3 border-b last:border-0" style={{ borderColor: "hsl(30,12%,92%)" }}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {a.imageData && <img src={a.imageData} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                <div className="flex flex-col min-w-0">
                  <span className="text-sm truncate" style={{ fontFamily: FONT_B }}>{a.text.slice(0, 50)}…</span>
                  <button onClick={() => toggleActive(a)} className="text-xs w-fit px-2 py-0.5 rounded-full mt-0.5" style={{ backgroundColor: a.active ? "hsl(142,50%,94%)" : "hsl(30,10%,90%)", color: a.active ? "hsl(142,72%,30%)" : "hsl(20,8%,50%)", fontFamily: FONT_B }}>
                    {a.active ? "● نشط" : "○ مخفي"}
                  </button>
                </div>
              </div>
              <RowActions onEdit={() => startEdit(a)} onDelete={() => del(a.id)} deleting={deletingId === a.id} />
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ backgroundColor: "#fff", border: `2px solid ${editId ? ACCENT : "hsl(30,12%,88%)"}` }}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base" style={{ fontFamily: FONT_H }}>{editId ? "تعديل الإعلان" : "إضافة إعلان جديد"}</h3>
          {editId && <button onClick={cancelEdit} className="text-xs px-3 py-1.5 rounded-lg" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)", backgroundColor: "hsl(30,10%,93%)" }}>إلغاء</button>}
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>نص توضيحي *</label>
            <textarea value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} placeholder="نص الإعلان..." rows={3}
              className="px-3.5 py-2.5 rounded-xl border text-sm outline-none resize-y"
              style={{ fontFamily: FONT_B, borderColor: "hsl(30,12%,82%)", backgroundColor: "#fff" }}
              onFocus={(e) => (e.target.style.borderColor = ACCENT)}
              onBlur={(e) => (e.target.style.borderColor = "hsl(30,12%,82%)")} />
          </div>
          <ImageUpload label="صورة الإعلان" value={form.imageData} onChange={(u) => setForm((f) => ({ ...f, imageData: u }))} />
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 rounded" />
              <span className="text-sm" style={{ fontFamily: FONT_B, color: "hsl(20,10%,30%)" }}>نشر الإعلان الآن</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Btn type="submit" disabled={saving || !form.text.trim()}>
              {saving ? "جاري الحفظ..." : ok ? "✓ تم!" : editId ? "حفظ التعديلات" : "نشر الإعلان"}
            </Btn>
            {ok && <span className="text-sm" style={{ color: "hsl(142,72%,35%)", fontFamily: FONT_B }}>تم بنجاح ✓</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Contact Tab ───────────────────────────────────────── */
function ContactTab() {
  const { contact, updateContact } = useContactInfo();
  const [form, setForm] = useState({ whatsapp: "", instagram: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      await updateContact({ whatsapp: form.whatsapp || contact.whatsapp, instagram: form.instagram || contact.instagram, email: form.email || contact.email });
      setOk(true); setTimeout(() => setOk(false), 3000);
    } catch (err: unknown) { alert("خطأ: " + (err as { message?: string }).message); }
    finally { setSaving(false); }
  }

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ backgroundColor: "#fff", border: "1px solid hsl(30,12%,88%)" }}>
      <h3 className="font-bold text-base" style={{ fontFamily: FONT_H }}>معلومات التواصل</h3>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="واتساب (+973...)" value={form.whatsapp || contact.whatsapp} onChange={(v) => setForm((f) => ({ ...f, whatsapp: v }))} placeholder="+97366XXXXXX" />
        <Field label="إنستقرام" value={form.instagram || contact.instagram} onChange={(v) => setForm((f) => ({ ...f, instagram: v }))} placeholder="https://instagram.com/..." />
        <Field label="البريد الإلكتروني" value={form.email || contact.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} placeholder="info@shaml.com" type="email" />
        <div className="flex items-center gap-3">
          <Btn type="submit" disabled={saving}>{saving ? "جاري الحفظ..." : ok ? "✓ تم!" : "حفظ التغييرات"}</Btn>
          {ok && <span className="text-sm" style={{ color: "hsl(142,72%,35%)", fontFamily: FONT_B }}>تم الحفظ ✓</span>}
        </div>
      </form>
    </div>
  );
}

/* ── Analytics Tab ─────────────────────────────────────── */
function AnalyticsTab() {
  const { stats, loading } = useAnalytics();
  const sorted = [...stats].sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl p-5" style={{ backgroundColor: "#fff", border: "1px solid hsl(30,12%,88%)" }}>
        <h3 className="font-bold text-base mb-4" style={{ fontFamily: FONT_H }}>إحصائيات النقرات على المشاريع</h3>
        {loading && <p style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)" }}>جاري التحميل...</p>}
        {!loading && sorted.length === 0 && (
          <p style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)", fontSize: "0.9rem" }}>لم يُسجَّل أي نقر بعد. تُسجَّل النقرات عندما يفتح الزوار مشاريعك.</p>
        )}
        {sorted.length > 0 && (
          <div className="flex flex-col gap-2">
            {sorted.map((s, i) => (
              <div key={s.projectId} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "hsl(30,10%,96%)" }}>
                <span className="text-sm font-bold w-6 text-center" style={{ fontFamily: "'Inter','Arial',sans-serif", color: "hsl(20,8%,55%)" }}>{i + 1}</span>
                <span className="flex-1 text-sm font-semibold" style={{ fontFamily: FONT_B }}>{s.projectName}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 rounded-full" style={{ width: Math.max(20, Math.round((s.clicks / sorted[0].clicks) * 120)), backgroundColor: ACCENT, opacity: 0.7 }} />
                  <span className="text-sm font-bold w-10 text-left" style={{ fontFamily: "'Inter','Arial',sans-serif", color: ACCENT }}>{s.clicks}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Admin Page ───────────────────────────────────── */
export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const { projects } = useProjects();
  const { statements } = useStatements();
  const { members } = useTeam();
  const { announcements } = useAnnouncements();
  const [tab, setTab] = useState<Tab>("projects");

  if (!user || !isAdmin) return <LoginScreen loading={loading} />;

  const tabs: { id: Tab; label: string; count?: number; adminOnly?: boolean }[] = [
    { id: "projects", label: "المشاريع", count: projects.length },
    { id: "statements", label: "التصريحات", count: statements.length },
    { id: "team", label: "الأيادي", count: members.length },
    { id: "announcements", label: "الإعلانات", count: announcements.length },
    { id: "contact", label: "التواصل" },
    { id: "analytics", label: "الإحصائيات", adminOnly: true },
  ];

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: "hsl(30,15%,96%)", minHeight: "100vh" }}>
      {/* Top bar */}
      <div className="w-full sticky top-[57px] z-30 border-b" style={{ backgroundColor: "#fff", borderColor: "hsl(30,12%,88%)" }}>
        <div className="max-w-4xl mx-auto px-5">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="w-8 h-8 rounded-lg" />
              <h1 className="text-lg font-bold" style={{ fontFamily: FONT_H, color: ACCENT }}>لوحة التحكم</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs hidden sm:block" style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)" }}>{user.email}</span>
              <button onClick={() => signOut(auth)}
                className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:bg-gray-50"
                style={{ fontFamily: FONT_B, color: "hsl(20,8%,45%)", borderColor: "hsl(30,12%,85%)" }}>خروج</button>
              <Link href="/" className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:bg-gray-50"
                style={{ fontFamily: FONT_B, color: "hsl(20,8%,45%)", borderColor: "hsl(30,12%,85%)" }}>الرئيسية</Link>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-0 overflow-x-auto pb-0 scrollbar-hide">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap flex-shrink-0"
                style={{ fontFamily: FONT_H, color: tab === t.id ? ACCENT : "hsl(20,8%,50%)", borderBottomColor: tab === t.id ? ACCENT : "transparent", backgroundColor: "transparent" }}>
                {t.label}
                {t.count !== undefined && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs"
                    style={{ backgroundColor: tab === t.id ? ACCENT_L : "hsl(30,10%,92%)", color: tab === t.id ? ACCENT : "hsl(20,8%,50%)", fontFamily: "'Inter','Arial',sans-serif" }}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="w-full border-b" style={{ backgroundColor: "#fff", borderColor: "hsl(30,12%,88%)" }}>
        <div className="max-w-4xl mx-auto px-5 py-3 grid grid-cols-4 gap-2">
          <StatPill label="مشاريع" value={projects.length} color="hsl(210,90%,95%)" />
          <StatPill label="تصريحات" value={statements.length} color="hsl(142,50%,94%)" />
          <StatPill label="أيادي" value={members.length} color={ACCENT_L} />
          <StatPill label="إعلانات" value={announcements.filter((a) => a.active).length} color="hsl(45,90%,94%)" />
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-5 py-6">
        {tab === "projects" && <ProjectsTab />}
        {tab === "statements" && <StatementsTab />}
        {tab === "team" && <TeamTab />}
        {tab === "announcements" && <AnnouncementsTab />}
        {tab === "contact" && <ContactTab />}
        {tab === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  );
}
