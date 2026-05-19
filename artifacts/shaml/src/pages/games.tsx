import { Link } from "wouter";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";

const ACCENT = "hsl(8, 61%, 41%)";
const FONT_H = "'Zaatar','Reem Kufi',sans-serif";
const FONT_B = "'Tajawal',sans-serif";

export default function GamesPage() {
  const { projects, loading } = useProjects("لعبة");

  return (
    <div className="flex-1" style={{ backgroundColor: "hsl(30,20%,97%)" }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 style={{ fontFamily: FONT_H, color: ACCENT, fontSize: "clamp(2rem,6vw,3rem)" }}>
            الألعاب
          </h1>
          <Link
            href="/"
            className="text-sm hover:opacity-70 transition-opacity"
            style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}
          >
            ← الرئيسية
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div
              className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: ACCENT, borderTopColor: "transparent" }}
            />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="text-5xl">🎮</span>
            <p style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)", fontSize: "1.1rem" }}>
              لا توجد ألعاب بعد — قريباً!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
