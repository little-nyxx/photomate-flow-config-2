import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function VideoPlayer({ code, isPlaying, playTrigger, onClose }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSrc, setActiveSrc] = useState(null);
  const [prevSrc, setPrevSrc] = useState(null);

  const videoSrc = `/videos/flow_${code}.mp4`;

  // When Run simulation is clicked (or re-clicked), reset state and play
  useEffect(() => {
    if (isPlaying) {
      setError(false);
      setLoading(true);
      setPrevSrc(activeSrc);
      setActiveSrc(videoSrc);
    }
  }, [isPlaying, playTrigger]);

  // When isPlaying turns off, clear everything
  useEffect(() => {
    if (!isPlaying) {
      setActiveSrc(null);
      setPrevSrc(null);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div
      className="absolute inset-0"
      style={{ zIndex: 1, pointerEvents: isPlaying ? "auto" : "none", opacity: isPlaying ? 1 : 0 }}
    >
      {/* Fallback background image while loading */}
      {loading && !error && (
        <img
          src="/images/factory.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />
      )}

      {/* New video — hidden until ready */}
      {!error && activeSrc && (
        <video
        ref={videoRef}
        src={activeSrc}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: !loading ? 1 : 0 }}
          loop
          preload="auto"
          controls={false}
          onError={() => setError(true)}
          onCanPlay={() => {
            setLoading(false);
            setPrevSrc(null);
            videoRef.current?.play();
          }}
          playsInline
        />
      )}

      {/* Loading spinner */}
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
          <div className="w-14 h-14 rounded-full border-4 border-white/20 border-t-white animate-spin" />
        </div>
      )}

      {/* Error modal — shown when video is unavailable */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="flex flex-col items-center gap-5 bg-black/60 backdrop-blur-md rounded-3xl px-14 py-10 text-white max-w-lg text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-primary" />
              </div>
              <p className="text-xl font-semibold">
                Video for scenario {activeSrc?.replace("/videos/flow_", "").replace(".mp4", "")} is not available yet.
              </p>
              <p className="text-sm text-white/50">
                Please check that the file {activeSrc?.replace("/videos/", "")} exists in the /videos folder.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}