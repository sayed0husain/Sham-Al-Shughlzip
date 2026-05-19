import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { Link } from "wouter";

const ACCENT = "hsl(8, 61%, 41%)";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  const { user, isAdmin } = useAuth();

  async function handleGoogleLogin() {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          backgroundColor: "rgba(0,0,0,0.35)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={onClose}
      />

      {/* Drawer — slides from LEFT (in LTR terms), but in RTL this is the start/right side visually */}
      <aside
        className="fixed top-0 right-0 z-50 h-full flex flex-col transition-transform duration-300"
        style={{
          width: 280,
          backgroundColor: "hsl(0,0%,100%)",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
        dir="rtl"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "hsl(30,12%,88%)" }}
        >
          <span
            className="text-lg font-bold"
            style={{ fontFamily: "'Zaatar','Reem Kufi',sans-serif", color: ACCENT }}
          >
            شمل
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="إغلاق"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1l16 16M17 1L1 17" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 p-4 flex-1">
          <Link
            href="/games"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-base font-medium"
            style={{ fontFamily: "'Zaatar','Reem Kufi',sans-serif", color: "hsl(20,10%,20%)" }}
          >
            🎮 الألعاب
          </Link>
          <Link
            href="/websites"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-base font-medium"
            style={{ fontFamily: "'Zaatar','Reem Kufi',sans-serif", color: "hsl(20,10%,20%)" }}
          >
            🌐 المواقع
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-base font-medium"
            style={{ fontFamily: "'Zaatar','Reem Kufi',sans-serif", color: "hsl(20,10%,20%)" }}
          >
            💬 التواصل معنا
          </Link>

          <div className="my-2 border-t" style={{ borderColor: "hsl(30,12%,88%)" }} />

          {user ? (
            <div className="flex flex-col gap-2">
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ backgroundColor: "hsl(30,10%,93%)" }}
              >
                {user.photoURL && (
                  <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                )}
                <span
                  className="text-sm truncate"
                  style={{ fontFamily: "'Tajawal',sans-serif", color: "hsl(20,10%,30%)" }}
                >
                  {user.displayName || user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-base font-medium"
                style={{ fontFamily: "'Tajawal',sans-serif", color: "hsl(8,61%,41%)" }}
              >
                تسجيل الخروج
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 transition-all hover:shadow-md font-medium"
              style={{
                borderColor: ACCENT,
                color: ACCENT,
                fontFamily: "'Zaatar','Reem Kufi',sans-serif",
                backgroundColor: "transparent",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.2 30.3 0 24 0 14.7 0 6.7 5.4 2.8 13.3l7.9 6.1C12.6 13.2 17.9 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.1 24.5c0-1.5-.1-3-.4-4.5H24v8.5h12.4c-.5 2.9-2.1 5.3-4.5 6.9l7 5.4c4.1-3.8 6.5-9.4 6.5-16.3z"/>
                <path fill="#FBBC05" d="M10.7 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.7-4.6L2.3 13.3A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.7l8.2-6.1z"/>
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7-5.4c-2.2 1.5-5 2.3-8.9 2.3-6.1 0-11.4-3.7-13.3-9.1l-8 6.1C6.7 42.6 14.7 48 24 48z"/>
              </svg>
              تسجيل الدخول عبر Google
            </button>
          )}
        </nav>
      </aside>
    </>
  );
}
