import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const BG_URL = "https://media.base44.com/images/public/6a0abd7d4f23084851e1d83f/150a26bbd_factory.jpg";

export default function VideoPlayer({ code, isPlaying, onClose }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);

  const VIDEO_URLS = {
    "0000": "https://media.base44.com/videos/public/6a0abd7d4f23084851e1d83f/cbb8210ef_flow_0000.mp4",
  };
  const videoSrc = VIDEO_URLS[code] || null;

  useEffect(() => {
    if (isPlaying) {
      setError(false);
    }
  }, [isPlaying, code]);

  if (!isPlaying) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BG_URL})` }}
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Top bar: scenario code + close button */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-2xl px-5 py-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-white font-bold text-xl tracking-widest font-mono">
              Scénář {code}
            </span>
          </div>
          <Button
            onClick={onClose}
            className="h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 text-white"
            variant="ghost"
            size="icon"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Video or error — centered over the background */}
        <div className="absolute inset-0 flex items-center justify-center">
          {error || !videoSrc ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-5 bg-black/60 backdrop-blur-md rounded-3xl px-14 py-10 text-white max-w-lg text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-primary" />
              </div>
              <p className="text-xl font-semibold">
                Video pro scénář {code} zatím není připravené.
              </p>
              <p className="text-sm text-white/50">
                Zkontrolujte, zda soubor flow_{code}.mp4 existuje ve složce /videos.
              </p>
            </motion.div>
          ) : (
            <video
              ref={videoRef}
              src={videoSrc}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              onError={() => setError(true)}
              playsInline
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}