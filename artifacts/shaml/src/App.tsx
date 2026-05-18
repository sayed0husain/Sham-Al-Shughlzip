import { useState, useEffect, useRef } from "react";
import { Switch, Route, Link } from "wouter";
import GamesPage from "./pages/games";
import WebsitesPage from "./pages/websites";

const ACCENT = "hsl(8, 61%, 41%)";
const FONT_HEADING = "'Zaatar', 'Reem Kufi', sans-serif";
const FONT_BODY = "'Tajawal', 'Arial', sans-serif";

function useCountUp(target: number, duration = 2000, startOnMount = true) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnMount || started.current) return;
    started.current = true;
    const startTime = performance.now();
    const startValue = 0;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startValue + eased * (target - startValue)));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration, startOnMount]);

  return count;
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="w-full border-b sticky top-0 z-50"
      style={{ backgroundColor: "hsl(0,0%,100%)", borderColor: "hsl(30,12%,88%)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* FAR LEFT: Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="القائمة"
          className="flex flex-col gap-1.5 p-2 rounded-lg transition-all hover:bg-gray-100"
        >
          <span
            className="block h-0.5 w-6 rounded-full transition-transform duration-300"
            style={{
              backgroundColor: ACCENT,
              transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none",
            }}
          />
          <span
            className="block h-0.5 w-6 rounded-full transition-opacity duration-300"
            style={{
              backgroundColor: ACCENT,
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block h-0.5 w-6 rounded-full transition-transform duration-300"
            style={{
              backgroundColor: ACCENT,
              transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none",
            }}
          />
        </button>

        {/* FAR RIGHT: Logo + Nav Links */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/websites"
              className="text-base font-medium transition-colors hover:opacity-70"
              style={{ fontFamily: FONT_HEADING, color: "hsl(20,10%,15%)" }}
            >
              المواقع
            </Link>
            <Link
              href="/games"
              className="text-base font-medium transition-colors hover:opacity-70"
              style={{ fontFamily: FONT_HEADING, color: "hsl(20,10%,15%)" }}
            >
              الألعاب
            </Link>
          </nav>

          <Link href="/">
            <img
              src="/logo.png"
              alt="شمل"
              className="h-10 w-10 rounded-lg object-cover cursor-pointer"
            />
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: menuOpen ? "140px" : "0" }}
      >
        <nav
          className="px-6 pb-4 flex flex-col gap-1 border-t"
          style={{ borderColor: "hsl(30,12%,88%)" }}
          onClick={() => setMenuOpen(false)}
        >
          <Link
            href="/games"
            className="text-base font-medium py-2 hover:opacity-70 transition-opacity"
            style={{ color: "hsl(20,10%,15%)", fontFamily: FONT_HEADING }}
          >
            الألعاب
          </Link>
          <Link
            href="/websites"
            className="text-base font-medium py-2 hover:opacity-70 transition-opacity"
            style={{ color: "hsl(20,10%,15%)", fontFamily: FONT_HEADING }}
          >
            المواقع
          </Link>
        </nav>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="w-full flex flex-col items-center text-center px-6 py-20 md:py-32 animate-fade-in-up">
      <h1
        className="font-bold leading-none tracking-tight mb-8"
        style={{
          color: ACCENT,
          fontFamily: FONT_HEADING,
          fontSize: "clamp(6rem, 18vw, 10rem)",
        }}
      >
        شمل
      </h1>
      <p
        className="max-w-2xl text-lg md:text-xl leading-loose"
        style={{ color: "hsl(20,8%,40%)", fontFamily: FONT_BODY }}
      >
        أن نكون الخيار الأول لجمع شمل العائلات والأصدقاء، من خلال ابتكار
        تجارب ترفيهية تُحيي التواصل الإنساني وتصنع ذكريات لا تُنسى في كل بيت
      </p>
    </section>
  );
}

function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <hr
        className="border-0 h-1 rounded-full"
        style={{ backgroundColor: ACCENT, opacity: 0.85 }}
      />
    </div>
  );
}

function VisitorCounter() {
  const count = useCountUp(1240, 2200);
  return <span>{count.toLocaleString("ar-SA")}</span>;
}

interface StatCardProps {
  label: string;
  children: React.ReactNode;
  delay?: string;
}

function StatCard({ label, children, delay = "" }: StatCardProps) {
  return (
    <div
      className={`rounded-3xl px-6 py-5 flex flex-col gap-2 animate-fade-in-up ${delay}`}
      style={{
        backgroundColor: "hsl(30,10%,93%)",
        border: "1px solid hsl(30,12%,88%)",
      }}
    >
      <span
        className="text-xs font-medium uppercase tracking-widest"
        style={{ color: "hsl(20,8%,55%)", fontFamily: FONT_BODY }}
      >
        {label}
      </span>
      <span
        className="text-2xl font-bold"
        style={{ color: "hsl(20,10%,15%)", fontFamily: FONT_HEADING }}
      >
        {children}
      </span>
    </div>
  );
}

function BottomSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
        {/* RIGHT SIDE */}
        <div className="flex-1 animate-fade-in-up delay-100">
          <h2
            className="text-2xl md:text-3xl font-bold mb-5"
            style={{ fontFamily: FONT_HEADING, color: "hsl(20,10%,15%)" }}
          >
            معلومات عن شمل
          </h2>
          <p
            className="text-base leading-loose"
            style={{ color: "hsl(20,8%,45%)", fontFamily: FONT_BODY }}
          >
            نسعى لصناعة ألعاب جماعية ذكية ومبتكرة، تجمع بين أصالة الثقافة
            ومتعة التحدي، لتكون الجسر الذي يربط بين الأجيال ويحول اللقاءات
            العادية إلى لحظات مليئة بالضحك والمنافسة الشريفة
          </p>
        </div>

        {/* LEFT SIDE: 2×2 stat cards */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="تاريخ التأسيس" delay="delay-200">
              2026
            </StatCard>
            <StatCard label="الأيادي العاملة في شمل" delay="delay-300">
              11
            </StatCard>
            <StatCard label="زوار موقع شمل" delay="delay-400">
              <VisitorCounter />
            </StatCard>
            <StatCard label="ألعاب مبتكرة" delay="delay-500">
              +15
            </StatCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="w-full border-t mt-4 py-6"
      style={{
        borderColor: "hsl(30,12%,88%)",
        backgroundColor: "hsl(30,10%,95%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-center">
        <p
          className="text-sm"
          style={{ color: "hsl(20,8%,55%)", fontFamily: FONT_BODY }}
        >
          © {new Date().getFullYear()} شمل. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      <HeroSection />
      <Divider />
      <BottomSection />
    </main>
  );
}

export default function App() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "hsl(30,20%,97%)" }}
      dir="rtl"
    >
      <Navbar />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/games" component={GamesPage} />
        <Route path="/websites" component={WebsitesPage} />
        <Route>
          <div
            className="flex-1 flex flex-col items-center justify-center"
            style={{ fontFamily: FONT_HEADING, color: ACCENT }}
          >
            <h1 style={{ fontSize: "3rem" }}>٤٠٤</h1>
            <p style={{ fontFamily: FONT_BODY, color: "hsl(20,8%,50%)" }}>
              الصفحة غير موجودة
            </p>
          </div>
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}
