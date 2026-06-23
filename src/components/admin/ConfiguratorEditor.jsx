import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, Loader2 } from "lucide-react";
import { IMAGES } from "@/lib/assets";
import { useLanguage } from "@/lib/LanguageContext";

export default function ConfiguratorEditor() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    base44.entities.ConfiguratorConfig.list()
      .then((records) => {
        setConfig(records[0] || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const res = await base44.integrations.Core.UploadFile({ file });
      if (config) {
        await base44.entities.ConfiguratorConfig.update(config.id, { bg_image_url: res.file_url });
        setConfig({ ...config, bg_image_url: res.file_url });
      } else {
        const created = await base44.entities.ConfiguratorConfig.create({ bg_image_url: res.file_url });
        setConfig(created);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-white/50">{t('admin_loading')}</div>;

  const bgUrl = config?.bg_image_url || IMAGES.factory;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <p className="text-primary font-bold text-lg mb-3">{t('admin_config_bg')}</p>
      <div className="flex items-center gap-4">
        <img src={bgUrl} alt="" className="w-48 h-32 object-cover rounded-lg" />
        <label className="cursor-pointer px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {t('admin_upload_bg')}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])}
          />
        </label>
      </div>
    </div>
  );
}