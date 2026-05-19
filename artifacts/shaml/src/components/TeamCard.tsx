import type { TeamMember } from "../hooks/useTeam";

const FONT_Z = "'Zaatar','Reem Kufi',sans-serif";
const FONT_B = "'Tajawal','Arial',sans-serif";
const ACCENT = "hsl(8, 61%, 41%)";

const VIP_NAMES = ["سيد حسين", "Sayed Husain", "sayed husain"];

function isVip(name: string) {
  return VIP_NAMES.some((v) => name.trim().toLowerCase() === v.toLowerCase() || name.trim() === v);
}

function NameDisplay({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return <span>{name}</span>;
  const [first, ...rest] = parts;
  return (
    <>
      <span style={{ fontFamily: FONT_Z }}>{first}</span>
      {rest.length > 0 && <span style={{ fontFamily: FONT_B }}> {rest.join(" ")}</span>}
    </>
  );
}

interface Props {
  member: TeamMember;
  vip?: boolean;
}

export default function TeamCard({ member, vip = false }: Props) {
  const vipMember = vip || isVip(member.name);

  return (
    <div
      className="flex flex-col gap-2 px-5 py-4 rounded-2xl transition-all"
      style={{
        backgroundColor: vipMember ? "hsl(8,30%,96%)" : "hsl(0,0%,100%)",
        border: vipMember ? `2px solid ${ACCENT}` : "1px solid hsl(30,12%,88%)",
        boxShadow: vipMember ? "0 4px 20px hsla(8,61%,41%,0.12)" : "0 1px 6px rgba(0,0,0,0.06)",
        position: "relative",
      }}
    >
      {vipMember && (
        <span
          className="absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: ACCENT, color: "#fff", fontFamily: FONT_B, fontSize: "0.65rem" }}
        >
          مؤسس
        </span>
      )}
      <p
        className="text-lg font-bold leading-tight"
        style={{ color: "hsl(20,10%,12%)", textAlign: "right" }}
      >
        <NameDisplay name={member.name} />
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "hsl(20,8%,45%)", fontFamily: FONT_B, textAlign: "right" }}>
        {member.contribution}
      </p>
      {member.contact && (
        <p className="text-xs" style={{ color: ACCENT, fontFamily: FONT_B, textAlign: "right", opacity: 0.8 }}>
          {member.contact}
        </p>
      )}
    </div>
  );
}
