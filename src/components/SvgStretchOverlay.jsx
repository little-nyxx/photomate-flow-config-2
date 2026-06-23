import React, { useState, useEffect } from "react";

export default function SvgStretchOverlay({ src, className }) {
  const [dataUri, setDataUri] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((res) => res.text())
      .then((text) => {
        if (cancelled) return;
        let modified;
        if (text.includes("preserveAspectRatio")) {
          modified = text.replace(/preserveAspectRatio="[^"]*"/, 'preserveAspectRatio="none"');
        } else {
          modified = text.replace(/<svg /, '<svg preserveAspectRatio="none" ');
        }
        setDataUri(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(modified)}`);
      })
      .catch(() => setDataUri(null));
    return () => { cancelled = true; };
  }, [src]);

  return (
    <img
      src={dataUri || src}
      className={className}
      style={{ objectFit: "fill", width: "100%", height: "100%" }}
    />
  );
}