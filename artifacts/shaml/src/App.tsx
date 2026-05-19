import { useState } from "react";
import { Switch, Route, Link } from "wouter";
import { useAuth } from "./hooks/useAuth";
import { useVisitors } from "./hooks/useVisitors";
import { useContactInfo } from "./hooks/useContactInfo";
import { useProjects } from "./hooks/useProjects";
import { useStatements } from "./hooks/useStatements";
import Sidebar from "./components/Sidebar";
import StatementBlock from "./components/StatementBlock";
import GamesPage from "./pages/games";
import WebsitesPage from "./pages/websites";
import ContactPage from "./pages/contact";
import AdminPage from "./pages/admin";

const ACCENT = "hsl(8, 61%, 41%)";
const FONT_H = "'Zaatar','Reem Kufi',sans-serif";
const FONT_B = "'Tajawal',sans-serif";
const FONT_NUM = "'Inter','Arial',sans-serif";

/* ─── Navbar ─────────────────────────────────────────────── */
function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdmin } = useAuth();

  return (
    <>
      <header
        className="w-full border-b sticky top-0 z-40"
        style={{ backgroundColor: "hsl(0,0%,100%)", borderColor: "hsl(30,12%,88%)" }}
      >
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
          {/* FAR LEFT: Hamburger + Home */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="القائمة"
              className="flex flex-col gap-1.5 p-2 rounded-lg transition-all hover:bg-gray-100"
            >
              {[0, 1, 2].map((i) => (
                <span key={i} className="block h-0.5 w-6 rounded-full" style={{ backgroundColor: ACCENT }} />
              ))}
            </button>
            <Link
              href="/"
              aria-label="الرئيسية"
              className="p-2 rounded-lg transition-all hover:bg-gray-100 flex items-center justify-center"
              style={{ color: ACCENT }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
                <path d="M9 21V12h6v9"/>
              </svg>
            </Link>
          </div>

          {/* FAR RIGHT: admin badge + logo + nav */}
          <div className="flex items-center gap-5">
            <nav className="hidden md:flex items-center gap-5">
              <Link
                href="/websites"
                className="text-base font-medium transition-opacity hover:opacity-65"
                style={{ fontFamily: FONT_H, color: "hsl(20,10%,15%)" }}
              >
                المواقع
              </Link>
              <Link
                href="/games"
                className="text-base font-medium transition-opacity hover:opacity-65"
                style={{ fontFamily: FONT_H, color: "hsl(20,10%,15%)" }}
              >
                الألعاب
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-85"
                  style={{ backgroundColor: ACCENT, color: "#fff", fontFamily: FONT_H }}
                >
                  لوحة التحكم
                </Link>
              )}
            </nav>
            <Link href="/">
              <img src="/logo.png" alt="شمل" className="h-10 w-10 rounded-lg object-cover cursor-pointer" />
            </Link>
          </div>
        </div>
      </header>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

/* ─── Hero ────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="w-full flex flex-col items-center text-center px-6 py-20 md:py-32 animate-fade-in-up">
      <h1
        className="font-bold leading-none tracking-tight mb-8"
        style={{ color: ACCENT, fontFamily: FONT_H, fontSize: "clamp(6rem, 18vw, 10rem)" }}
      >
        شمل
      </h1>
      <p className="max-w-2xl text-lg md:text-xl leading-loose" style={{ color: "hsl(20,8%,40%)", fontFamily: FONT_B }}>
        أن نكون الخيار الأول لجمع شمل العائلات والأصدقاء، من خلال ابتكار
        تجارب ترفيهية تُحيي التواصل الإنساني وتصنع ذكريات لا تُنسى في كل بيت
      </p>
    </section>
  );
}

/* ─── Divider ─────────────────────────────────────────────── */
function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <hr className="border-0 h-1 rounded-full" style={{ backgroundColor: ACCENT, opacity: 0.85 }} />
    </div>
  );
}

/* ─── Stat card ───────────────────────────────────────────── */
interface StatCardProps {
  label: string;
  value: React.ReactNode;
  delay?: string;
}
function StatCard({ label, value, delay = "" }: StatCardProps) {
  return (
    <div
      className={`rounded-3xl px-6 py-5 flex flex-col gap-2 animate-fade-in-up ${delay}`}
      style={{ backgroundColor: "hsl(30,10%,93%)", border: "1px solid hsl(30,12%,88%)" }}
    >
      <span className="text-xs font-medium tracking-wide" style={{ color: "hsl(20,8%,55%)", fontFamily: FONT_B }}>
        {label}
      </span>
      <span className="text-2xl font-bold" style={{ color: "hsl(20,10%,15%)", fontFamily: FONT_NUM }}>
        {value}
      </span>
    </div>
  );
}

/* ─── Visitor counter ─────────────────────────────────────── */
function VisitorCounter() {
  const count = useVisitors();
  return <>{count}</>;
}

/* ─── Bottom section ──────────────────────────────────────── */
function BottomSection() {
  const { projects: games } = useProjects("لعبة");
  const { projects: sites } = useProjects("موقع");

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
        <div className="flex-1 animate-fade-in-up delay-100">
          <h2 className="text-2xl md:text-3xl font-bold mb-5" style={{ fontFamily: FONT_H, color: "hsl(20,10%,15%)" }}>
            معلومات عن شمل
          </h2>
          <p className="text-base leading-loose" style={{ color: "hsl(20,8%,45%)", fontFamily: FONT_B }}>
            نسعى لصناعة ألعاب جماعية ذكية ومبتكرة، تجمع بين أصالة الثقافة
            ومتعة التحدي، لتكون الجسر الذي يربط بين الأجيال ويحول اللقاءات
            العادية إلى لحظات مليئة بالضحك والمنافسة الشريفة
          </p>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="تاريخ التأسيس" value="2026" delay="delay-200" />
            <StatCard label="الأيادي العاملة في شمل" value="11" delay="delay-300" />
            <StatCard label="زوار موقع شمل" value={<VisitorCounter />} delay="delay-400" />
            <StatCard
              label="ألعاب مبتكرة"
              value={games.length + sites.length > 0 ? games.length + sites.length : 0}
              delay="delay-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Statements section ──────────────────────────────────── */
function StatementsSection() {
  const { statements, loading } = useStatements();
  const { projects } = useProjects();

  if (loading || statements.length === 0) return null;

  return (
    <section
      className="w-full"
      style={{ borderTop: "1px solid hsl(30,12%,88%)", backgroundColor: "hsl(30,15%,96%)" }}
    >
      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10">
        <h2
          className="text-3xl font-bold"
          style={{ fontFamily: FONT_H, color: ACCENT, textAlign: "right" }}
        >
          التصريحات
        </h2>

        {statements.map((stmt) => (
          <article
            key={stmt.id}
            className="flex flex-col gap-4 pb-10"
            style={{ borderBottom: "1px solid hsl(30,12%,88%)" }}
          >
            {/* Title */}
            <h3
              style={{
                fontFamily: FONT_H,
                fontSize: "1.4rem",
                color: "hsl(20,10%,12%)",
                textAlign: "right",
              }}
            >
              {stmt.title}
            </h3>

            {/* Images */}
            {stmt.imageUrls && stmt.imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-end">
                {stmt.imageUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="rounded-xl object-cover"
                    style={{ height: 180, width: "auto", maxWidth: "100%" }}
                  />
                ))}
              </div>
            )}

            {/* Content with smart parser */}
            <StatementBlock content={stmt.content} projects={projects} />
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────── */
function Footer() {
  const { contact } = useContactInfo();

  function formatWhatsapp(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (digits.startsWith("973")) return digits;
    if (digits.startsWith("00973")) return digits.slice(2);
    return `973${digits}`;
  }

  return (
    <footer
      className="w-full border-t py-6"
      style={{ borderColor: "hsl(30,12%,88%)", backgroundColor: "hsl(30,10%,95%)" }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm" style={{ color: "hsl(20,8%,55%)", fontFamily: FONT_B }}>
          © {new Date().getFullYear()} شمل. جميع الحقوق محفوظة.
        </p>

        <div className="flex items-center gap-3">
          {contact.whatsapp && (
            <a
              href={`https://wa.me/${formatWhatsapp(contact.whatsapp)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: "#25D366" }}
              aria-label="واتساب"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          )}
          {contact.instagram && (
            <a
              href={contact.instagram.startsWith("http") ? contact.instagram : `https://instagram.com/${contact.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
              style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}
              aria-label="إنستقرام"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: ACCENT }}
              aria-label="البريد الإلكتروني"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}

/* ─── Home page ───────────────────────────────────────────── */
function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      <HeroSection />
      <Divider />
      <BottomSection />
      <StatementsSection />
    </main>
  );
}

/* ─── App root ────────────────────────────────────────────── */
export default function App() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "hsl(30,20%,97%)" }} dir="rtl">
      <Navbar />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/games" component={GamesPage} />
        <Route path="/websites" component={WebsitesPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/admin" component={AdminPage} />
        <Route>
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <h1 style={{ fontFamily: FONT_H, color: ACCENT, fontSize: "3.5rem" }}>٤٠٤</h1>
            <p style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>الصفحة غير موجودة</p>
            <Link href="/" style={{ color: ACCENT, fontFamily: FONT_H }}>العودة للرئيسية</Link>
          </div>
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}
