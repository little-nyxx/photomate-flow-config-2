import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, Loader2 } from "lucide-react";

export default function BackgroundEditor() {
  const [bgs, setBgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    base44.entities.BackgroundConfig.list()
      .then((records) => {
        records.sort((a, b) => a.index - b.index);
        setBgs(records);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (bg, field, file) => {
    const key = `${bg.id}-${field}`;
    setUploading(key);
    try {
      const res = await base44.integrations.Core.UploadFile({ file });
      const updated = { ...bg, [field]: res.file_url };
      setBgs((prev) => prev.map((b) => (b.id === bg.id ? updated : b)));
      await base44.entities.BackgroundConfig.update(bg.id, { [field]: res.file_url });
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(null);
    }
  };

  if (loading) return <div className="text-white/50">Načítání...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {bgs.map((bg) => (
        <div key={bg.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-primary font-bold text-lg mb-3">Pozadí #{bg.index + 1}</p>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/50 mb-2">Pozadí sales</p>
              <div className="flex items-center gap-3">
                {bg.bg_image_url ? (
                  <img src={bg.bg_image_url} alt="" className="w-24 h-16 object-cover rounded-lg" />
                ) : (
                  <div className="w-24 h-16 bg-white/10 rounded-lg flex items-center justify-center text-white/30 text-xs">—</div>
                )}
                <label className="cursor-pointer px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2">
                  {uploading === `${bg.id}-bg_image_url` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Nahrát
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files[0] && handleUpload(bg, "bg_image_url", e.target.files[0])}
                  />
                </label>
              </div>
            </div>
            <div>
              <p className="text-sm text-white/50 mb-2">Packy (SVG overlay)</p>
              <div className="flex items-center gap-3">
                {bg.overlay_url ? (
                  <img src={bg.overlay_url} alt="" className="w-24 h-16 object-contain bg-white/10 rounded-lg p-1" />
                ) : (
                  <div className="w-24 h-16 bg-white/10 rounded-lg flex items-center justify-center text-white/30 text-xs">—</div>
                )}
                <label className="cursor-pointer px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2">
                  {uploading === `${bg.id}-overlay_url` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Nahrát
                  <input
                    type="file"
                    accept="image/svg+xml,image/*"
                    className="hidden"
                    onChange={(e) => e.target.files[0] && handleUpload(bg, "overlay_url", e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}