import { useEffect } from "react";
import { Link } from "wouter";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { useStats, recordVisit } from "../hooks/useStats";
import { useWorkers } from "../hooks/useWorkers";
import { AnnouncementBanner } from "../components/AnnouncementBanner";

export default function Home() {
  const { active } = useAnnouncements();
  const { stats } = useStats();
  const { workers } = useWorkers();

  useEffect(() => { recordVisit(); }, []);

  const statCards = [
    { label: "زوار الموقع", value: stats.totalVisitors, icon: "👁️", color: "from-blue-500 to-indigo-600" },
    { label: "الإعلانات النشطة", value: stats.totalAnnouncements, icon: "📢", color: "from-violet-500 to-purple-600" },
    { label: "فريق العمل", value: workers.length, icon: "👥", color: "from-emerald-500 to-teal-600" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground flex flex-col">
      <AnnouncementBanner announcements={active} />

      <header className="bg-sidebar text-sidebar-foreground shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-xl shadow-sm">🌐</div>
            <div>
              <h1 className="text-xl font-bold leading-tight">مواقع شمل</h1>
              <p className="text-xs text-sidebar-foreground/60">منصة مشاريع شمل الرقمية</p>
            </div>
          </div>
          <Link href="/admin">
            <button className="text-xs px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary-foreground/80 transition-colors">
              لوحة التحكم
            </button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-sidebar via-sidebar to-indigo-900 text-sidebar-foreground py-20 px-4">
          <div className="absolute inset-0 opacity-5">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="absolute rounded-full bg-white"
                style={{ width: `${30 + (i * 17) % 80}px`, height: `${30 + (i * 17) % 80}px`, top: `${(i * 23) % 100}%`, left: `${(i * 37) % 100}%`, opacity: 0.3 + (i % 5) * 0.1 }} />
            ))}
          </div>
          <div className="relative max-w-3xl mx-auto text-center space-y-5">
            <span className="inline-block bg-primary/20 text-primary-foreground px-4 py-1 rounded-full text-sm font-medium border border-primary/30">
              ✨ منصة مواقع شمل الرقمية
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              نبني تجارب رقمية<br />
              <span className="text-primary">استثنائية</span>
            </h2>
            <p className="text-sidebar-foreground/70 text-lg max-w-xl mx-auto">
              فريق متخصص في تطوير المواقع والتطبيقات وحلول الأعمال الرقمية.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-12">
          <h3 className="text-xl font-bold mb-6 text-center">إحصائيات المنصة</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statCards.map((s) => (
              <div key={s.label} className="bg-card border border-card-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold font-num text-foreground">{s.value.toLocaleString("ar")}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {workers.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 pb-12">
            <h3 className="text-xl font-bold mb-6 text-center">فريق العمل</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {workers.map((w) => (
                <div key={w.id} className={`bg-card border rounded-2xl p-4 text-center shadow-sm ${w.isAdmin ? "border-primary/50 ring-1 ring-primary/30" : "border-card-border"}`}>
                  <div className="text-3xl mb-2">{w.emoji || "👤"}</div>
                  <p className="font-semibold text-sm truncate">{w.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{w.role}</p>
                  {w.isAdmin && (
                    <span className="mt-1.5 inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">مؤسس</span>
                  )}
                  {w.percentage > 0 && (
                    <p className="text-xs text-muted-foreground font-num mt-1">{w.percentage}%</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-sidebar text-sidebar-foreground/60 py-4 text-center text-xs">
        <p>© {new Date().getFullYear()} مواقع شمل — جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
