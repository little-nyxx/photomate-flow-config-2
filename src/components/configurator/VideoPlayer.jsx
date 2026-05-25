import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function VideoPlayer({ code, isPlaying, onClose }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const videoSrc = `/videos/flow_${code}.mp4`;

  useEffect(() => {
    if (isPlaying) {
      setError(false);
      setLoading(true);
    }
  }, [isPlaying, code]);

  if (!isPlaying) return null;

  return (
    <>
      {/* Video as page background */}
      {!error && (
        <video
          ref={videoRef}
          src={videoSrc}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ zIndex: 1, opacity: !loading ? 1 : 0 }}
          autoPlay
          loop
          preload="auto"
          controls={false}
          onError={() => setError(true)}
          onCanPlay={() => setLoading(false)}
          playsInline
        />
      )}

      {/* Loading spinner — shown while video is loading */}
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
                Video for scenario {code} is not available yet.
              </p>
              <p className="text-sm text-white/50">
                Please check that the file flow_{code}.mp4 exists in the /videos folder.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}