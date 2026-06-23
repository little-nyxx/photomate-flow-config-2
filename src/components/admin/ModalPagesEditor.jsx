import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Trash2, Loader2, Plus, Upload, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function ModalPagesEditor({ circleId }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { t } = useLanguage();
  const fileInputRef = useRef(null);

  const loadPages = () => {
    base44.entities.ModalPage.filter({ circle_id: circleId })
      .then((records) => {
        records.sort((a, b) => a.page_number - b.page_number);
        setPages(records);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPages();
  }, [circleId]);

  const handleAddPage = async (file) => {
    setUploading(true);
    try {
      const res = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.ModalPage.create({
        circle_id: circleId,
        page_number: pages.length,
        image_url: res.file_url,
      });
      loadPages();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleReplacePage = async (file) => {
    if (!selectedPage) return;
    setActionLoading(true);
    try {
      const res = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.ModalPage.update(selectedPage.id, { image_url: res.file_url });
      setSelectedPage(null);
      loadPages();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemovePage = async (pageId) => {
    setActionLoading(true);
    try {
      await base44.entities.ModalPage.delete(pageId);
      setSelectedPage(null);
      loadPages();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <p className="text-sm text-white/50 mb-2">{t('admin_modal_pages')} ({pages.length})</p>
      <div className="flex flex-wrap gap-2 items-center">
        {loading ? (
          <div className="text-white/30 text-sm">{t('admin_loading')}</div>
        ) : (
          <>
            {pages.map((page, idx) => (
              <div key={page.id} className="relative">
                <button
                  onClick={() => setSelectedPage(page)}
                  className="relative block"
                >
                  <img src={page.image_url} alt="" className="w-16 h-16 object-contain bg-white/10 rounded-lg p-1 hover:ring-2 hover:ring-primary transition-all" />
                  <span className="absolute top-0 left-0 bg-primary text-white text-xs px-1 rounded-br">{idx + 1}</span>
                </button>
              </div>
            ))}
            <label className="cursor-pointer w-16 h-16 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files[0] && handleAddPage(e.target.files[0])}
              />
            </label>
          </>
        )}
      </div>

      {/* Popup overlay */}
      {selectedPage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => !actionLoading && setSelectedPage(null)}
        >
          <div
            className="bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-white font-semibold">{t('admin_modal_page')}</p>
              <button
                onClick={() => !actionLoading && setSelectedPage(null)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={selectedPage.image_url} alt="" className="w-48 h-48 object-contain bg-white/10 rounded-lg p-2 mb-4 mx-auto" />
            <div className="flex gap-3">
              <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {t('admin_upload')}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files[0] && handleReplacePage(e.target.files[0])}
                />
              </label>
              <button
                onClick={() => handleRemovePage(selectedPage.id)}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/90 text-white font-semibold hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                {t('admin_delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}