import type { TeamMember } from "../hooks/useTeam";

const FONT_B = "'Tajawal','Arial',sans-serif";
const ACCENT = "hsl(8, 61%, 41%)";

const VIP_NAMES = ["سيد حسين", "Sayed Husain"];
export function isVip(name: string) {
  return VIP_NAMES.some((v) => name.trim().toLowerCase() === v.toLowerCase() || name.trim() === v);
}

interface Props {
  member: TeamMember;
  vip?: boolean;
}

export default function TeamCard({ member, vip = false }: Props) {
  const vipMember = vip || isVip(member.name);

  return (
    <div
      className="flex flex-col gap-3 px-5 py-4 rounded-2xl transition-all"
      style={{
        backgroundColor: vipMember ? "hsl(8,30%,96%)" : "hsl(0,0%,100%)",
        border: vipMember ? `2px solid ${ACCENT}` : "1px solid hsl(30,12%,88%)",
        boxShadow: vipMember ? "0 4px 20px hsla(8,61%,41%,0.12)" : "0 1px 6px rgba(0,0,0,0.06)",
        position: "relative",
      }}
    >
      {vipMember && (
        <span className="absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: ACCENT, color: "#fff", fontFamily: FONT_B, fontSize: "0.65rem" }}>
          مؤسس
        </span>
      )}

      <div className="flex items-start gap-3">
        {member.emoji && (
          <span className="text-3xl flex-shrink-0 mt-0.5">{member.emoji}</span>
        )}
        <div className="flex flex-col gap-1 flex-1 text-right">
          <p className="text-lg font-bold leading-tight" style={{ color: "hsl(20,10%,12%)", fontFamily: FONT_B }}>
            {member.name}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "hsl(20,8%,45%)", fontFamily: FONT_B }}>
            {member.contribution}
          </p>
          {member.emojiDescription && (
            <p className="text-xs" style={{ color: "hsl(20,8%,60%)", fontFamily: FONT_B }}>{member.emojiDescription}</p>
          )}
          {member.contact && (
            <p className="text-xs mt-0.5" style={{ color: ACCENT, fontFamily: FONT_B, opacity: 0.85 }}>
              {member.contact}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
