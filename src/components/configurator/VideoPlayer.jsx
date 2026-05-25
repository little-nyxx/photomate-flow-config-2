import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


const BG_URL = "/images/factory.jpg";

export default function VideoPlayer({ code, isPlaying, onClose }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lokální videa umístěte do složky /public/videos/ jako flow_XXXX.mp4
  const videoSrc = `/videos/flow_${code}.mp4`;

  useEffect(() => {
    if (isPlaying) {
      setError(false);
      setLoading(true);
    }
  }, [isPlaying, code]);

  // Video plays as page background — no modal overlay
  return (
    <>
      {isPlaying && !error && (
        <video
          ref={videoRef}
          src={videoSrc}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ zIndex: 1, opacity: isPlaying && !loading ? 1 : 0 }}
          autoPlay
          loop
          preload="auto"
          controls={false}
          onError={() => setError(true)}
          onCanPlay={() => setLoading(false)}
          playsInline
        />
      )}
    </>
  );
}