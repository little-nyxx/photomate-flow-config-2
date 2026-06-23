import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Trash2, Loader2, Plus } from "lucide-react";

export default function ModalPagesEditor({ circleId }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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

  const handleRemovePage = async (pageId) => {
    try {
      await base44.entities.ModalPage.delete(pageId);
      loadPages();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <p className="text-sm text-white/50 mb-2">Stránky modalu ({pages.length})</p>
      <div className="flex flex-wrap gap-2 items-center">
        {loading ? (
          <div className="text-white/30 text-sm">Načítání...</div>
        ) : (
          <>
            {pages.map((page, idx) => (
              <div key={page.id} className="relative group">
                <img src={page.image_url} alt="" className="w-16 h-16 object-contain bg-white/10 rounded-lg p-1" />
                <span className="absolute top-0 left-0 bg-primary text-white text-xs px-1 rounded-br">{idx + 1}</span>
                <button
                  onClick={() => handleRemovePage(page.id)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3 text-white" />
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
    </div>
  );
}