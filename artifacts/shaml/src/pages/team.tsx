import { useTeam } from "../hooks/useTeam";
import TeamCard, { isVip } from "../components/TeamCard";

const FONT_H = "'Zaatar','Reem Kufi',sans-serif";
const FONT_B = "'Tajawal',sans-serif";
const ACCENT = "hsl(8, 61%, 41%)";

export default function TeamPage() {
  const { members, loading } = useTeam();

  const vip = members.filter((m) => isVip(m.name));
  const rest = members.filter((m) => !isVip(m.name));

  return (
    <main className="flex-1 max-w-4xl mx-auto px-5 py-12 w-full">
      <h1 className="text-3xl font-bold mb-2 text-right" style={{ fontFamily: FONT_H, color: "hsl(20,10%,12%)" }}>
        الأيادي العاملة
      </h1>
      <p className="text-base mb-10 text-right" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>
        الفريق الذي يصنع شمل
      </p>

      {loading && (
        <div className="text-center py-20" style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)" }}>
          جاري التحميل...
        </div>
      )}

      {!loading && members.length === 0 && (
        <div className="text-center py-20" style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)" }}>
          لم يُضف أي عضو بعد
        </div>
      )}

      {!loading && members.length > 0 && (
        <div className="flex flex-col gap-8">
          {/* VIP pinned at top */}
          {vip.length > 0 && (
            <div className="flex flex-col gap-3">
              {vip.map((m) => <TeamCard key={m.id} member={m} vip />)}
            </div>
          )}

          {/* Separator */}
          {vip.length > 0 && rest.length > 0 && (
            <div style={{ height: 1, backgroundColor: "hsl(30,12%,88%)" }} />
          )}

          {/* Rest grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rest.map((m) => <TeamCard key={m.id} member={m} />)}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
