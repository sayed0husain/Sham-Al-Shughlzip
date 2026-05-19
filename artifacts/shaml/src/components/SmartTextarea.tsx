import { useRef, useState, useEffect } from "react";
import type { Project } from "../hooks/useProjects";

const ACCENT = "hsl(8, 61%, 41%)";
const FONT_B = "'Tajawal','Arial',sans-serif";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  projects: Project[];
  hint?: string;
}

export default function SmartTextarea({ value, onChange, placeholder, rows = 6, projects, hint }: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [percentIdx, setPercentIdx] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function handleKeyUp(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const ta = textareaRef.current;
    if (!ta) return;
    const cursor = ta.selectionStart;
    const before = ta.value.slice(0, cursor);
    const lastPercent = before.lastIndexOf("%");
    if (lastPercent !== -1 && !before.slice(lastPercent + 1).includes("\n")) {
      setPercentIdx(lastPercent);
      setShowDropdown(true);
      positionDropdown(ta, lastPercent);
    } else {
      setShowDropdown(false);
      setPercentIdx(-1);
    }
  }

  function positionDropdown(ta: HTMLTextAreaElement, _idx: number) {
    const rect = ta.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + window.scrollY + 4, left: rect.right - 220 });
  }

  function selectProject(p: Project) {
    if (percentIdx === -1) return;
    const before = value.slice(0, percentIdx);
    const after = value.slice(percentIdx + 1);
    const link = `[${p.name}](${p.projectUrl})`;
    onChange(before + link + after);
    setShowDropdown(false);
    setPercentIdx(-1);
  }

  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-xs font-semibold uppercase tracking-wide" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>
        التصريح *
      </label>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyUp={handleKeyUp}
        onClick={handleKeyUp as unknown as React.MouseEventHandler}
        placeholder={placeholder}
        rows={rows}
        className="px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all resize-y"
        style={{ fontFamily: FONT_B, borderColor: "hsl(30,12%,82%)", backgroundColor: "#fff", color: "hsl(20,10%,15%)" }}
        onFocus={(e) => (e.target.style.borderColor = ACCENT)}
        onBlur={(e) => (e.target.style.borderColor = "hsl(30,12%,82%)")}
      />
      {hint && <p className="text-xs" style={{ fontFamily: FONT_B, color: "hsl(20,8%,55%)" }}>{hint}</p>}

      {showDropdown && projects.filter((p) => p.projectUrl).length > 0 && (
        <div ref={dropdownRef}
          className="fixed z-50 rounded-xl overflow-hidden shadow-xl"
          style={{ top: dropdownPos.top, left: dropdownPos.left, backgroundColor: "#fff", border: "1px solid hsl(30,12%,85%)", minWidth: 220, maxWidth: 300 }}>
          <div className="px-3 py-2 border-b" style={{ borderColor: "hsl(30,12%,90%)", backgroundColor: "hsl(30,10%,97%)" }}>
            <span className="text-xs font-semibold" style={{ fontFamily: FONT_B, color: "hsl(20,8%,50%)" }}>اختر مشروعاً</span>
          </div>
          {projects.filter((p) => p.projectUrl).map((p) => (
            <button key={p.id} type="button"
              onMouseDown={(e) => { e.preventDefault(); selectProject(p); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-right hover:bg-gray-50 transition-colors"
              style={{ fontFamily: FONT_B, color: "hsl(20,10%,20%)" }}>
              <span>{p.emoji || "🔗"}</span>
              <span className="flex-1 truncate">{p.name}</span>
              <span className="text-xs flex-shrink-0" style={{ color: ACCENT }}>↗</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
