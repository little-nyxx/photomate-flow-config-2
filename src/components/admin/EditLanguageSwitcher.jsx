import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { ALL_LANGUAGES } from "@/lib/translations";

export default function EditLanguageSwitcher({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = ALL_LANGUAGES.find((l) => l.code === value) || ALL_LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <span className="sm:hidden uppercase">{current.code}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-44 max-h-72 overflow-y-auto rounded-xl bg-zinc-900 border border-white/10 shadow-2xl py-1 z-50">
          {ALL_LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => { onChange(l.code); setOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-white/10 transition-colors ${l.code === value ? "text-primary font-semibold" : "text-white"}`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base leading-none">{l.flag}</span>
                {l.label}
              </span>
              {l.code === value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}