import { useState } from "react";
import type { Project } from "../hooks/useProjects";

const ACCENT = "hsl(8, 61%, 41%)";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const [expanded, setExpanded] = useState(false);

  function handleCardClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest(".emoji-badge")) return;
    if (project.projectUrl) {
      window.open(project.projectUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      onClick={handleCardClick}
      style={{
        aspectRatio: "3/4",
        minHeight: 320,
        boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
        cursor: project.projectUrl ? "pointer" : "default",
      }}
    >
      {/* Background image */}
      {project.bgImageUrl ? (
        <img
          src={project.bgImageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: "hsl(30,10%,88%)" }} />
      )}

      {/* Overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.04) 100%)",
        }}
      />

      {/* Center transparent image */}
      {project.centerImageUrl && (
        <div className="absolute inset-0 flex items-center justify-center pb-20">
          <img
            src={project.centerImageUrl}
            alt={project.name}
            className="w-2/3 max-h-40 object-contain drop-shadow-lg"
          />
        </div>
      )}

      {/* "Open link" badge if URL exists */}
      {project.projectUrl && (
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.9)", backdropFilter: "blur(6px)", fontFamily: "'Tajawal',sans-serif" }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          فتح
        </div>
      )}

      {/* Text at bottom */}
      <div className="absolute bottom-0 right-0 left-0 p-4 text-right">
        <h3
          className="text-white font-bold text-xl mb-1 leading-tight"
          style={{ fontFamily: "'Zaatar','Reem Kufi',sans-serif" }}
        >
          {project.name}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.78)", fontFamily: "'Tajawal',sans-serif" }}
        >
          {project.description}
        </p>
      </div>

      {/* Emoji badge */}
      <button
        onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
        className="emoji-badge absolute top-3 left-3 flex items-center justify-center transition-all duration-500 select-none focus:outline-none"
        style={{
          width: expanded ? 160 : 44,
          height: expanded ? 160 : 44,
          borderRadius: expanded ? "1.25rem" : "50%",
          backgroundColor: expanded ? "rgba(255,255,255,0.96)" : ACCENT,
          boxShadow: expanded ? "0 8px 32px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.22)",
          overflow: "hidden",
          padding: expanded ? "0.75rem" : "0",
          zIndex: 10,
        }}
        aria-label={expanded ? "إغلاق" : "معلومات"}
      >
        {expanded ? (
          <span
            className="text-center text-sm leading-snug"
            style={{ color: "hsl(20,10%,20%)", fontFamily: "'Tajawal',sans-serif" }}
          >
            <span className="text-2xl block mb-1">{project.emoji}</span>
            {project.emojiDescription}
          </span>
        ) : (
          <span className="text-2xl leading-none">{project.emoji}</span>
        )}
      </button>
    </div>
  );
}
