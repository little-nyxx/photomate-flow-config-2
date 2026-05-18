import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VideoPlayer({ code, isPlaying, onClose }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Since videos must be bundled, we reference them from public folder
  // In a real APK build, these would be in assets
  const videoSrc = `/videos/flow_${code}.mp4`;

  useEffect(() => {
    if (isPlaying) {
      setError(false);
      setPaused(false);
      setProgress(0);
    }
  }, [isPlaying, code]);

  const handleError = () => {
    setError(true);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  const handleEnded = () => {
    setPaused(true);
    setProgress(100);
  };

  const togglePause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPaused(false);
    } else {
      videoRef.current.pause();
      setPaused(true);
    }
  };

  const restart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setPaused(false);
  };

  if (!isPlaying) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-[90vw] max-w-5xl bg-card rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="font-bold text-lg">Scénář {code}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full h-10 w-10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Video area */}
          <div className="relative aspect-video bg-black">
            {error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <AlertTriangle className="h-10 w-10 text-primary" />
                </div>
                <p className="text-xl font-semibold text-center px-8">
                  Video pro scénář {code} zatím není připravené.
                </p>
                <p className="text-sm text-white/50">
                  Zkontrolujte, zda soubor flow_{code}.mp4 existuje ve složce videos.
                </p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={videoSrc}
                  className="w-full h-full object-contain"
                  autoPlay
                  onError={handleError}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleEnded}
                  playsInline
                />
                {/* Controls overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-white/20 rounded-full mb-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={togglePause}
                      className="text-white hover:bg-white/20 h-12 w-12 rounded-full"
                    >
                      {paused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={restart}
                      className="text-white hover:bg-white/20 h-12 w-12 rounded-full"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}