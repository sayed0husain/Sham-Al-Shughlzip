import { useState } from "react";

const ACCENT = "hsl(8, 61%, 41%)";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="w-full border-b sticky top-0 z-50"
      style={{ backgroundColor: "hsl(0,0%,100%)", borderColor: "hsl(30,12%,88%)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* FAR LEFT in visual space: Hamburger */}
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

        {/* FAR RIGHT in visual space: Logo + Nav Links */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-base font-medium transition-colors hover:opacity-80"
              style={{ fontFamily: "var(--app-font-sans)", color: "hsl(20,10%,15%)" }}
            >
              المواقع
            </a>
            <a
              href="#"
              className="text-base font-medium transition-colors hover:opacity-80"
              style={{ fontFamily: "var(--app-font-sans)", color: "hsl(20,10%,15%)" }}
            >
              الألعاب
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="شمل"
              className="h-10 w-10 rounded-lg object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: menuOpen ? "120px" : "0" }}
      >
        <nav
          className="px-6 pb-4 flex flex-col gap-3 border-t"
          style={{ borderColor: "hsl(30,12%,88%)" }}
        >
          <a
            href="#"
            className="text-base font-medium py-2 hover:opacity-70 transition-opacity"
            style={{ color: "hsl(20,10%,15%)", fontFamily: "var(--app-font-sans)" }}
          >
            الألعاب
          </a>
          <a
            href="#"
            className="text-base font-medium py-2 hover:opacity-70 transition-opacity"
            style={{ color: "hsl(20,10%,15%)", fontFamily: "var(--app-font-sans)" }}
          >
            المواقع
          </a>
        </nav>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="w-full flex flex-col items-center text-center px-6 py-20 md:py-32 animate-fade-in-up">
      <h1
        className="font-heading text-8xl md:text-9xl font-bold leading-none tracking-tight mb-8"
        style={{ color: ACCENT, fontFamily: "var(--app-font-heading)" }}
      >
        شمل
      </h1>
      <p
        className="max-w-xl text-lg md:text-xl leading-relaxed"
        style={{ color: "hsl(20,8%,40%)", fontFamily: "var(--app-font-sans)" }}
      >
        رؤية الشركة رؤية الشركة رؤية الشركة رؤية الشركة رؤية الشركة رؤية
        الشركة رؤية الشركة رؤية الشركة رؤية الشركة رؤية الشركة رؤية الشركة
        رؤية الشركة
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

interface StatCardProps {
  label: string;
  value: string;
  delay?: string;
}

function StatCard({ label, value, delay = "" }: StatCardProps) {
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
        style={{ color: "hsl(20,8%,55%)", fontFamily: "var(--app-font-sans)" }}
      >
        {label}
      </span>
      <span
        className="text-2xl font-bold"
        style={{ color: "hsl(20,10%,15%)", fontFamily: "var(--app-font-heading)" }}
      >
        {value}
      </span>
    </div>
  );
}

function BottomSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
        {/* RIGHT SIDE (in RTL = displayed on the right visually, first in RTL DOM order) */}
        <div className="flex-1 order-1 md:order-1 animate-fade-in-up delay-100">
          <h2
            className="text-2xl md:text-3xl font-bold mb-5"
            style={{
              fontFamily: "var(--app-font-heading)",
              color: "hsl(20,10%,15%)",
            }}
          >
            معلومات الشركة
          </h2>
          <p
            className="text-base leading-loose"
            style={{ color: "hsl(20,8%,45%)", fontFamily: "var(--app-font-sans)" }}
          >
            معلومات الشركة معلومات الشركة معلومات الشركة معلومات الشركة معلومات
            الشركة معلومات الشركة معلومات الشركة معلومات الشركة معلومات الشركة
            معلومات الشركة معلومات الشركة معلومات الشركة معلومات الشركة معلومات
            الشركة معلومات الشركة معلومات الشركة معلومات الشركة معلومات الشركة
          </p>
        </div>

        {/* LEFT SIDE (in RTL = displayed on the left visually, second in RTL DOM order) */}
        <div className="flex-1 order-2 md:order-2">
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="تاريخ التأسيس" value="رقم" delay="delay-200" />
            <StatCard label="شي جانبي" value="شي جانبي" delay="delay-300" />
            <StatCard label="زوار موقع شمل" value="رقم زوار الموقع" delay="delay-400" />
            <StatCard label="الأيادي العاملة في شمل" value="رقم" delay="delay-500" />
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
          style={{ color: "hsl(20,8%,55%)", fontFamily: "var(--app-font-sans)" }}
        >
          © {new Date().getFullYear()} شمل. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
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
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <Divider />
        <BottomSection />
      </main>
      <Footer />
    </div>
  );
}
