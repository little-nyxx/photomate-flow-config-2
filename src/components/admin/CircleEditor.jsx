import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, Save, Loader2 } from "lucide-react";
import ModalPagesEditor from "@/components/admin/ModalPagesEditor";
import { useLanguage } from "@/lib/LanguageContext";

export default function CircleEditor({ editLang }) {
  const [circles, setCircles] = useState([]);
  const [labels, setLabels] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [uploading, setUploading] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [circleRecords, labelRecords] = await Promise.all([
          base44.entities.CircleConfig.list(),
          base44.entities.CircleLabel.list()
        ]);
        circleRecords.sort((a, b) => a.circle_id - b.circle_id);
        setCircles(circleRecords);

        const labelMap = {};
        labelRecords.forEach((r) => {
          labelMap[`${r.circle_id}-${r.language}`] = r;
        });
        setLabels(labelMap);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLabelChange = (circleId, value) => {
    setLabels((prev) => ({
      ...prev,
      [`${circleId}-${editLang}`]: { ...prev[`${circleId}-${editLang}`], label: value, circle_id: circleId, language: editLang }
    }));
  };

  const handleSave = async (circle) => {
    setSaving(circle.id);
    try {
      const labelKey = `${circle.circle_id}-${editLang}`;
      const labelRecord = labels[labelKey];
      if (labelRecord?.id) {
        await base44.entities.CircleLabel.update(labelRecord.id, { label: labelRecord.label });
      } else if (labelRecord?.label) {
        await base44.entities.CircleLabel.create({ circle_id: circle.circle_id, language: editLang, label: labelRecord.label });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(null);
    }
  };

  const handleUpload = async (circle, field, file) => {
    const key = `${circle.id}-${field}`;
    setUploading(key);
    try {
      const res = await base44.integrations.Core.UploadFile({ file });
      const updated = { ...circle, [field]: res.file_url };
      setCircles((prev) => prev.map((c) => (c.id === circle.id ? updated : c)));
      await base44.entities.CircleConfig.update(circle.id, { [field]: res.file_url });
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(null);
    }
  };

  if (loading) return <div className="text-white/50">{t('admin_loading')}</div>;

  return (
    <div className="space-y-4">
      {circles.map((circle) => {
        const labelKey = `${circle.circle_id}-${editLang}`;
        const currentLabel = labels[labelKey]?.label || "";
        return (
        <div key={circle.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-primary font-bold w-8">#{circle.circle_id}</span>
            <input
              type="text"
              value={currentLabel}
              onChange={(e) => handleLabelChange(circle.circle_id, e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white focus:outline-none focus:border-primary"
              placeholder={t('admin_label_placeholder')}
            />
            <button
              onClick={() => handleSave(circle)}
              disabled={saving === circle.id}
              className="px-4 py-2 rounded-lg bg-primary text-white font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
            >
              {saving === circle.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {t('admin_save')}
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {circle.circle_id !== 0 && (
            <div>
              <p className="text-sm text-white/50 mb-2">{t('admin_circle_image')}</p>
              <div className="flex items-center gap-3">
                {circle.circle_image_url ? (
                  <img src={circle.circle_image_url} alt="" className="w-16 h-16 object-contain bg-white/10 rounded-lg p-1" />
                ) : (
                  <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center text-white/30 text-xs">—</div>
                )}
                <label className="cursor-pointer px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2">
                  {uploading === `${circle.id}-circle_image_url` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {t('admin_upload')}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files[0] && handleUpload(circle, "circle_image_url", e.target.files[0])}
                  />
                </label>
              </div>
            </div>
            )}
            <ModalPagesEditor circleId={circle.circle_id} editLang={editLang} />
          </div>
        </div>
        );
      })}
    </div>
  );
}