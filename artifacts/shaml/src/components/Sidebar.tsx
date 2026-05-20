import { signInWithPopup, signInWithRedirect, signOut, getRedirectResult } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { Link } from "wouter";
import { useEffect } from "react";

const ACCENT = "hsl(8, 61%, 41%)";
const FONT_BRAND = "'Zaatar','Reem Kufi',sans-serif";
const FONT_NAV = "'Tajawal','Arial',sans-serif";

interface Props { open: boolean; onClose: () => void; }

export default function Sidebar({ open, onClose }: Props) {
  const { user, isAdmin } = useAuth();

  useEffect(() => { getRedirectResult(auth).catch(() => {}); }, []);

  async function handleGoogleLogin() {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/popup-blocked" || code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        try { await signInWithRedirect(auth, googleProvider); } catch { /* silent */ }
      }
    }
  }

  async function handleAppleLogin() {
    try {
      await signInWithPopup(auth, appleProvider);
      onClose();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/popup-blocked" || code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        try { await signInWithRedirect(auth, appleProvider); } catch { /* silent */ }
      }
    }
  }

  async function handleLogout() { await signOut(auth); onClose(); }

  const navStyle = { fontFamily: FONT_NAV, color: "hsl(20,10%,20%)", fontSize: "1rem", fontWeight: 500 };

  const navLinks = [
    { href: "/", label: "🏠 الرئيسية" },
    { href: "/games", label: "🎮 الألعاب" },
    { href: "/websites", label: "🌐 المواقع" },
    { href: "/team", label: "🤝 الأيادي العاملة" },
    { href: "/contact", label: "💬 التواصل معنا" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{ backgroundColor: "rgba(0,0,0,0.35)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={onClose} />

      <aside className="fixed top-0 right-0 z-50 h-full flex flex-col transition-transform duration-300"
        style={{ width: 280, backgroundColor: "hsl(0,0%,100%)", boxShadow: "-4px 0 24px rgba(0,0,0,0.12)", transform: open ? "translateX(0)" : "translateX(100%)" }}
        dir="rtl">

        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "hsl(30,12%,88%)" }}>
          <span className="text-lg font-bold" style={{ fontFamily: FONT_BRAND, color: ACCENT }}>شمل</span>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="إغلاق">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1l16 16M17 1L1 17" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              style={navStyle}>
              {l.label}
            </Link>
          ))}

          {isAdmin && (
            <Link href="/admin" onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              style={{ ...navStyle, color: ACCENT, fontWeight: 700 }}>
              ⚙️ لوحة التحكم
            </Link>
          )}

          <div className="my-2 border-t" style={{ borderColor: "hsl(30,12%,88%)" }} />

          {user ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "hsl(30,10%,93%)" }}>
                {user.photoURL && <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />}
                <span className="text-sm truncate" style={{ fontFamily: FONT_NAV, color: "hsl(20,10%,30%)" }}>
                  {user.displayName || user.email}
                </span>
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors"
                style={{ fontFamily: FONT_NAV, color: ACCENT, fontWeight: 500, fontSize: "1rem" }}>
                🚪 تسجيل الخروج
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 transition-all hover:shadow-md"
                style={{ borderColor: ACCENT, color: ACCENT, fontFamily: FONT_NAV, fontWeight: 600, fontSize: "0.95rem", backgroundColor: "transparent" }}>
                <GoogleIcon />
                تسجيل الدخول عبر Google
              </button>
              <button onClick={handleAppleLogin}
                className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 transition-all hover:shadow-md"
                style={{ borderColor: "hsl(20,8%,20%)", color: "hsl(20,8%,20%)", fontFamily: FONT_NAV, fontWeight: 600, fontSize: "0.95rem", backgroundColor: "transparent" }}>
                <AppleIcon />
                تسجيل الدخول عبر Apple
              </button>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.2 30.3 0 24 0 14.7 0 6.7 5.4 2.8 13.3l7.9 6.1C12.6 13.2 17.9 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.1 24.5c0-1.5-.1-3-.4-4.5H24v8.5h12.4c-.5 2.9-2.1 5.3-4.5 6.9l7 5.4c4.1-3.8 6.5-9.4 6.5-16.3z"/>
      <path fill="#FBBC05" d="M10.7 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.7-4.6L2.3 13.3A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.7l8.2-6.1z"/>
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7-5.4c-2.2 1.5-5 2.3-8.9 2.3-6.1 0-11.4-3.7-13.3-9.1l-8 6.1C6.7 42.6 14.7 48 24 48z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }} fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zm3.378-3.066c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
    </svg>
  );
}
