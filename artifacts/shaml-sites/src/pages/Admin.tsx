import { useState } from "react";
import { Link } from "wouter";
import { signInWithPopup, signOut, type User } from "firebase/auth";
import { auth, googleProvider, appleProvider, ADMIN_EMAIL } from "../lib/firebase";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { useWorkers } from "../hooks/useWorkers";
import { useStats, incrementStat } from "../hooks/useStats";
import { ImageUpload } from "../components/ImageUpload";

type Tab = "stats" | "announcements" | "workers";

function LoginScreen({ onLogin }: { onLogin: (u: User) => void }) {
  const [loading, setLoading] = useState<"google" | "apple" | null>(null);
  const [error, setError] = useState("");

  async function signIn(provider: "google" | "apple") {
    setLoading(provider); setError("");
    try {
      const prov = provider === "google" ? googleProvider : appleProvider;
      const result = await signInWithPopup(auth, prov);
      if (result.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        setError("هذا الحساب غير مصرح له بالدخول.");
      } else {
        onLogin(result.user);
      }
    } catch (e: unknown) {
      const msg = (e as { code?: string })?.code;
      if (msg !== "auth/popup-closed-by-user") setError("فشل تسجيل الدخول. حاول مجدداً.");
    } finally { setLoading(null); }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card border border-card-border rounded-2xl p-8 shadow-lg text-center space-y-6">
        <div>
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground mt-1">مواقع شمل — للمسؤولين فقط</p>
        </div>
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-3 py-2 text-sm">
            {error}
          </div>
        )}
        <div className="space-y-3">
          <button
            onClick={() => signIn("google")}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-2 bg-white border border-border text-foreground rounded-xl px-4 py-3 text-sm font-medium hover:bg-muted/40 transition-colors disabled:opacity-60 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {loading === "google" ? "جاري الدخول..." : "تسجيل الدخول بـ Google"}
          </button>
          <button
            onClick={() => signIn("apple")}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-60 shadow-sm"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"/><path d="M15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/></svg>
            {loading === "apple" ? "جاري الدخول..." : "تسجيل الدخول بـ Apple"}
          </button>
        </div>
        <Link href="/">
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← العودة للرئيسية
          </button>
        </Link>
      </div>
    </div>
  );
}

function StatsTab() {
  const { stats, loading } = useStats();
  const cards = [
    { key: "totalVisitors", label: "إجمالي الزوار", icon: "👁️", color: "bg-blue-500/10 text-blue-600" },
    { key: "totalUsers", label: "المستخدمون", icon: "👤", color: "bg-violet-500/10 text-violet-600" },
    { key: "totalOperations", label: "إجمالي العمليات", icon: "⚡", color: "bg-amber-500/10 text-amber-600" },
    { key: "totalAnnouncements", label: "الإعلانات", icon: "📢", color: "bg-emerald-500/10 text-emerald-600" },
    { key: "totalWorkers", label: "العمال", icon: "👥", color: "bg-pink-500/10 text-pink-600" },
  ] as const;

  if (loading) return <div className="p-8 text-center text-muted-foreground text-sm">جاري التحميل...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.key} className="bg-card border border-card-border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className={`w-11 h-11 rounded-xl ${c.color} flex items-center justify-center text-xl flex-shrink-0`}>
            {c.icon}
          </div>
          <div>
            <p className="text-2xl font-bold font-num">{stats[c.key].toLocaleString("ar")}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnnouncementsTab() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncements();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", text: "", imageData: "", active: true });
  const [saving, setSaving] = useState(false);

  function resetForm() { setForm({ title: "", text: "", imageData: "", active: true }); setEditId(null); }
  function startAdd() { resetForm(); setMode("add"); }
  function startEdit(a: typeof announcements[0]) {
    setForm({ title: a.title, text: a.text, imageData: a.imageData, active: a.active });
    setEditId(a.id); setMode("edit");
  }

  async function save() {
    if (!form.text.trim()) return;
    setSaving(true);
    try {
      if (mode === "add") {
        await addAnnouncement(form);
        await incrementStat("totalAnnouncements");
      } else if (editId) {
        await updateAnnouncement(editId, form);
      }
      setMode("list"); resetForm();
    } finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm("هل تريد حذف هذا الإعلان؟")) return;
    await deleteAnnouncement(id);
    await incrementStat("totalAnnouncements", -1);
  }

  if (mode !== "list") return (
    <div className="bg-card border border-card-border rounded-xl p-6 max-w-lg">
      <h3 className="font-bold text-lg mb-5">{mode === "add" ? "إضافة إعلان" : "تعديل الإعلان"}</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">العنوان (اختياري)</label>
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="عنوان الإعلان"
            className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">النص *</label>
          <textarea value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            placeholder="نص الإعلان..." rows={3}
            className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
        </div>
        <ImageUpload value={form.imageData} onChange={(v) => setForm((f) => ({ ...f, imageData: v }))} label="صورة الإعلان (اختياري)" />
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            className="w-4 h-4 accent-primary" />
          <span className="text-sm">نشط</span>
        </label>
        <div className="flex gap-2 pt-2">
          <button onClick={save} disabled={saving || !form.text.trim()}
            className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors">
            {saving ? "جاري الحفظ..." : "حفظ"}
          </button>
          <button onClick={() => { setMode("list"); resetForm(); }}
            className="flex-1 bg-secondary text-secondary-foreground rounded-lg py-2 text-sm hover:bg-secondary/80 transition-colors">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">الإعلانات <span className="text-muted-foreground font-num text-sm ml-1">({announcements.length})</span></h3>
        <button onClick={startAdd} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
          + إضافة إعلان
        </button>
      </div>
      {announcements.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm bg-card border border-card-border rounded-xl">لا توجد إعلانات بعد</div>
      )}
      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="bg-card border border-card-border rounded-xl p-4 flex gap-3 items-start shadow-sm">
            {a.imageData && <img src={a.imageData} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              {a.title && <p className="font-semibold text-sm">{a.title}</p>}
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{a.text}</p>
              <span className={`mt-1.5 inline-block text-xs px-2 py-0.5 rounded-full ${a.active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                {a.active ? "نشط" : "معطل"}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button onClick={() => startEdit(a)} className="text-xs text-primary hover:underline">تعديل</button>
              <button onClick={() => del(a.id)} className="text-xs text-destructive hover:underline">حذف</button>
              <button onClick={() => updateAnnouncement(a.id, { active: !a.active })}
                className="text-xs text-muted-foreground hover:underline">
                {a.active ? "إيقاف" : "تفعيل"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkersTab() {
  const { workers, addWorker, updateWorker, deleteWorker } = useWorkers();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", emoji: "👤", email: "", isAdmin: false, percentage: 0 });
  const [saving, setSaving] = useState(false);

  const EMOJI_PRESETS = ["👤", "👨‍💻", "👩‍💻", "🎨", "📊", "🛠️", "🚀", "⭐", "💡", "🔧", "📱", "💎"];

  function resetForm() { setForm({ name: "", role: "", emoji: "👤", email: "", isAdmin: false, percentage: 0 }); setEditId(null); }
  function startAdd() { resetForm(); setMode("add"); }
  function startEdit(w: typeof workers[0]) {
    setForm({ name: w.name, role: w.role, emoji: w.emoji || "👤", email: w.email || "", isAdmin: w.isAdmin, percentage: w.percentage || 0 });
    setEditId(w.id); setMode("edit");
  }

  async function save() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (mode === "add") {
        await addWorker(form);
        await incrementStat("totalWorkers");
      } else if (editId) {
        await updateWorker(editId, form);
      }
      setMode("list"); resetForm();
    } finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm("هل تريد حذف هذا العامل؟")) return;
    await deleteWorker(id);
    await incrementStat("totalWorkers", -1);
  }

  if (mode !== "list") return (
    <div className="bg-card border border-card-border rounded-xl p-6 max-w-lg">
      <h3 className="font-bold text-lg mb-5">{mode === "add" ? "إضافة عامل" : "تعديل العامل"}</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-2">الإيموجي</label>
          <div className="flex flex-wrap gap-2">
            {EMOJI_PRESETS.map((e) => (
              <button key={e} type="button"
                onClick={() => setForm((f) => ({ ...f, emoji: e }))}
                className={`text-xl p-1.5 rounded-lg border transition-colors ${form.emoji === e ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                {e}
              </button>
            ))}
            <input value={form.emoji} onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
              maxLength={2} className="w-12 text-center text-xl border border-input rounded-lg bg-background" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">الاسم *</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="اسم العامل" className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">المسمى الوظيفي</label>
          <input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            placeholder="مطور، مصمم..." className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">البريد الإلكتروني</label>
          <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            type="email" placeholder="example@email.com"
            className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring font-num" dir="ltr" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">
            نسبة العمولة % <span className="font-num text-primary">{form.percentage}%</span>
          </label>
          <div className="flex items-center gap-3">
            <input type="range" min={0} max={100} step={1}
              value={form.percentage} onChange={(e) => setForm((f) => ({ ...f, percentage: Number(e.target.value) }))}
              className="flex-1 accent-primary" />
            <input type="number" min={0} max={100}
              value={form.percentage} onChange={(e) => setForm((f) => ({ ...f, percentage: Math.min(100, Math.max(0, Number(e.target.value))) }))}
              className="w-16 border border-input rounded-lg px-2 py-1 text-sm bg-background text-center font-num focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={form.isAdmin} onChange={(e) => setForm((f) => ({ ...f, isAdmin: e.target.checked }))}
            className="w-4 h-4 accent-primary" />
          <span className="text-sm">مسؤول / مؤسس</span>
        </label>
        <div className="flex gap-2 pt-2">
          <button onClick={save} disabled={saving || !form.name.trim()}
            className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors">
            {saving ? "جاري الحفظ..." : "حفظ"}
          </button>
          <button onClick={() => { setMode("list"); resetForm(); }}
            className="flex-1 bg-secondary text-secondary-foreground rounded-lg py-2 text-sm hover:bg-secondary/80 transition-colors">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">العمال <span className="text-muted-foreground font-num text-sm ml-1">({workers.length})</span></h3>
        <button onClick={startAdd} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
          + إضافة عامل
        </button>
      </div>
      {workers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm bg-card border border-card-border rounded-xl">لا يوجد عمال بعد</div>
      )}
      <div className="space-y-2">
        {workers.map((w) => (
          <div key={w.id} className={`bg-card border rounded-xl p-4 flex items-center gap-3 shadow-sm ${w.isAdmin ? "border-primary/40 ring-1 ring-primary/20" : "border-card-border"}`}>
            <div className="text-2xl w-10 text-center flex-shrink-0">{w.emoji || "👤"}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm">{w.name}</p>
                {w.isAdmin && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">مؤسس</span>}
              </div>
              {w.role && <p className="text-xs text-muted-foreground">{w.role}</p>}
              {w.email && <p className="text-xs text-muted-foreground font-num" dir="ltr">{w.email}</p>}
            </div>
            {w.percentage > 0 && (
              <div className="text-center flex-shrink-0">
                <p className="text-lg font-bold text-primary font-num">{w.percentage}%</p>
                <p className="text-xs text-muted-foreground">عمولة</p>
              </div>
            )}
            <div className="flex flex-col gap-1 flex-shrink-0">
              <button onClick={() => startEdit(w)} className="text-xs text-primary hover:underline">تعديل</button>
              <button onClick={() => del(w.id)} className="text-xs text-destructive hover:underline">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>("stats");

  if (!user) return <LoginScreen onLogin={setUser} />;

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "stats", label: "الإحصائيات", icon: "📊" },
    { key: "announcements", label: "الإعلانات", icon: "📢" },
    { key: "workers", label: "العمال", icon: "👥" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <header className="bg-sidebar text-sidebar-foreground shadow-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-lg">🌐</div>
            <div>
              <h1 className="font-bold text-base leading-tight">مواقع شمل</h1>
              <p className="text-xs text-sidebar-foreground/60">لوحة التحكم</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {user.photoURL && <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" />}
              <span className="text-xs text-sidebar-foreground/70 hidden sm:block">{user.displayName}</span>
            </div>
            <button onClick={() => signOut(auth).then(() => setUser(null))}
              className="text-xs px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-1 bg-muted/50 rounded-xl p-1 mb-6 border border-border">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${tab === t.key ? "bg-card text-foreground shadow-sm border border-card-border" : "text-muted-foreground hover:text-foreground"}`}>
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {tab === "stats" && <StatsTab />}
        {tab === "announcements" && <AnnouncementsTab />}
        {tab === "workers" && <WorkersTab />}
      </div>
    </div>
  );
}
