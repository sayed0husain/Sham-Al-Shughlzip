import { useState, useRef, useEffect } from "react";
import type { Project } from "../hooks/useProjects";

const ACCENT = "hsl(8, 61%, 41%)";
const FONT_Z = "'Zaatar','Reem Kufi',sans-serif";
const FONT_B = "'Tajawal','Arial',sans-serif";

interface Props {
  content: string;
  projects: Project[];
}

interface Suggestion {
  id: string;
  name: string;
  url: string;
}

function SuggestionMenu({
  projects,
  onSelect,
  onClose,
}: {
  projects: Project[];
  onSelect: (p: Project) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <span
      ref={ref}
      className="inline-block relative"
      style={{ verticalAlign: "middle" }}
    >
      <span
        className="inline-flex flex-col rounded-xl overflow-hidden"
        style={{
          backgroundColor: "hsl(0,0%,100%)",
          border: "1px solid hsl(30,12%,85%)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          minWidth: 180,
          position: "absolute",
          bottom: "calc(100% + 4px)",
          right: 0,
          zIndex: 50,
        }}
      >
        {projects.length === 0 ? (
          <span className="px-4 py-3 text-sm" style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)" }}>
            لا توجد مشاريع
          </span>
        ) : (
          projects.filter((p) => p.projectUrl).map((p) => (
            <a
              key={p.id}
              href={p.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onSelect(p)}
              className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm"
              style={{ fontFamily: FONT_B, color: "hsl(20,10%,20%)", textDecoration: "none" }}
            >
              <span>{p.emoji}</span>
              <span>{p.name}</span>
              <span className="text-xs mr-auto" style={{ color: ACCENT }}>↗</span>
            </a>
          ))
        )}
      </span>
    </span>
  );
}

function renderToken(
  token: string,
  fontSize: string,
  projects: Project[],
  key: string | number
): React.ReactNode {
  if (token === "%") {
    return <PercentTrigger key={key} projects={projects} />;
  }
  if (token.toLowerCase() === "شمل" || token === "شمل") {
    return (
      <span key={key} style={{ fontFamily: FONT_Z, fontSize }}>
        شمل
      </span>
    );
  }
  return <span key={key}>{token}</span>;
}

function PercentTrigger({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block" style={{ verticalAlign: "middle" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
        style={{ backgroundColor: ACCENT, color: "#fff", fontFamily: FONT_B, lineHeight: 1.4 }}
      >
        🔗 مشاريع
      </button>
      {open && (
        <SuggestionMenu
          projects={projects}
          onSelect={() => setOpen(false)}
          onClose={() => setOpen(false)}
        />
      )}
    </span>
  );
}

function parseLine(line: string, projects: Project[], idx: number): React.ReactNode {
  const isHeading = line.startsWith("#");
  const text = isHeading ? line.slice(1).trim() : line;
  const fontSize = isHeading ? "1.5rem" : "1rem";

  const tokens = text.split(/(شمل|%)/g);

  const content = (
    <span>
      {tokens.map((token, i) => renderToken(token, fontSize, projects, i))}
    </span>
  );

  if (isHeading) {
    return (
      <h3
        key={idx}
        style={{
          fontFamily: FONT_Z,
          fontSize: "1.6rem",
          color: "hsl(20,10%,12%)",
          margin: "0.75rem 0 0.35rem",
          lineHeight: 1.3,
        }}
      >
        {content}
      </h3>
    );
  }

  return (
    <p key={idx} style={{ fontFamily: FONT_B, fontSize: "1rem", lineHeight: 1.85, margin: "0.2rem 0", color: "hsl(20,8%,30%)" }}>
      {content}
    </p>
  );
}

export default function StatementBlock({ content, projects }: Props) {
  const lines = content.split("\n");
  return (
    <div style={{ textAlign: "right", direction: "rtl" }}>
      {lines.map((line, i) => parseLine(line, projects, i))}
    </div>
  );
}
