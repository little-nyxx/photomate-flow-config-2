import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, Loader2 } from "lucide-react";

export default function VideoEditor() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    base44.entities.VideoConfig.list()
      .then((records) => {
        records.sort((a, b) => a.code.localeCompare(b.code));
        setVideos(records);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (video, file) => {
    setUploading(video.id);
    try {
      const res = await base44.integrations.Core.UploadFile({ file });
      const updated = { ...video, video_url: res.file_url };
      setVideos((prev) => prev.map((v) => (v.id === video.id ? updated : v)));
      await base44.entities.VideoConfig.update(video.id, { video_url: res.file_url });
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(null);
    }
  };

  if (loading) return <div className="text-white/50">Načítání...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <div key={video.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-primary font-bold text-lg mb-2">{video.code}</p>
          {video.video_url ? (
            <video src={video.video_url} className="w-full h-24 object-cover rounded-lg mb-2" muted />
          ) : (
            <div className="w-full h-24 bg-white/10 rounded-lg flex items-center justify-center text-white/30 text-sm mb-2">Bez videa</div>
          )}
          <label className="cursor-pointer w-full px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm flex items-center justify-center gap-2">
            {uploading === video.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Nahrát video
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => e.target.files[0] && handleUpload(video, e.target.files[0])}
            />
          </label>
        </div>
      ))}
    </div>
  );
}