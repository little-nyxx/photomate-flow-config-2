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
    <div
      className={className}
      style={{
        backgroundImage: dataUri ? `url("${dataUri}")` : `url(${src})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    />
  );
}