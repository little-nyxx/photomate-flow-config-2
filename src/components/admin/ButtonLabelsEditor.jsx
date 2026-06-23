import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";
import { ALL_LANGUAGES } from "@/lib/translations";

const BUTTONS = [
  { id: "ems_button", label: "EMS Button", page: "sales" },
  { id: "back", label: "Back Button", page: "configurator" },
  { id: "run_simulation", label: "Run Simulation", page: "configurator" },
  { id: "reset", label: "Reset", page: "configurator" },
  { id: "param_spot", label: "Parameter: Spot", page: "configurator" },
  { id: "param_vyroba", label: "Parameter: Výroba", page: "configurator" },
  { id: "param_spotreba", label: "Parameter: Spotřeba", page: "configurator" },
  { id: "param_teplota", label: "Parameter: Teplota", page: "configurator" }
];

export default function ButtonLabelsEditor({ editLang }) {
  const { t } = useLanguage();
  const [labels, setLabels] = useState({});
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    base44.entities.ButtonLabel.list()
      .then((records) => {
        const map = {};
        records.forEach((r) => {
          const key = `${r.button_id}_${r.language}`;
          map[key] = r.label;
        });
        setLabels(map);
        setDrafts(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (buttonId, language, value) => {
    const key = `${buttonId}_${language}`;
    setDrafts((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (buttonId) => {
    setSaving((prev) => ({ ...prev, [buttonId]: true }));
    try {
      for (const lang of ALL_LANGUAGES) {
        const key = `${buttonId}_${lang.code}`;
        if (labels[key] !== drafts[key]) {
          const existing = await base44.entities.ButtonLabel.filter({
            button_id: buttonId,
            language: lang.code
          });
          
          if (existing.length > 0) {
            await base44.entities.ButtonLabel.update(existing[0].id, { label: drafts[key] });
          } else {
            await base44.entities.ButtonLabel.create({ button_id: buttonId, language: lang.code, label: drafts[key] });
          }
        }
      }
      setLabels((prev) => {
        const updated = { ...prev };
        for (const lang of ALL_LANGUAGES) {
          const key = `${buttonId}_${lang.code}`;
          updated[key] = drafts[key];
        }
        return updated;
      });
    } catch (error) {
      console.error("Error saving button labels:", error);
    } finally {
      setSaving((prev) => ({ ...prev, [buttonId]: false }));
    }
  };

  if (loading) return <p className="text-white/60">{t('loading')}</p>;

  return (
    <div className="grid gap-6">
      {BUTTONS.map((btn) => (
        <div key={btn.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="font-semibold text-white mb-1">{btn.label}</h3>
          <p className="text-xs text-white/50 mb-3">{btn.page}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {ALL_LANGUAGES.map((lang) => {
              const key = `${btn.id}_${lang.code}`;
              const isActive = editLang === lang.code;
              const hasChanges = labels[key] !== drafts[key];
              return (
                <div key={lang.code}>
                  <label className="block text-xs font-medium text-white/70 mb-1">
                    {lang.flag} {lang.label}
                  </label>
                  <input
                    type="text"
                    value={drafts[key] || ""}
                    onChange={(e) => handleChange(btn.id, lang.code, e.target.value)}
                    placeholder={`${lang.label} text`}
                    disabled={saving[btn.id]}
                    className={`w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-primary transition-all disabled:opacity-50 ${
                      isActive ? "ring-2 ring-primary" : ""
                    } ${hasChanges ? "border-primary" : ""}`}
                  />
                </div>
              );
            })}
          </div>
          <button
            onClick={() => handleSave(btn.id)}
            disabled={saving[btn.id]}
            className="w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {saving[btn.id] ? "Ukládání..." : "Uložit"}
          </button>
        </div>
      ))}
    </div>
  );
}