import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function useIdleRedirect(timeoutMs = 60000, targetPath = "/") {
  const navigate = useNavigate();
  const timer = useRef(null);

  useEffect(() => {
    const reset = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        navigate(targetPath);
      }, timeoutMs);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];
    events.forEach((e) => window.addEventListener(e, reset));
    reset();

    return () => {
      clearTimeout(timer.current);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [navigate, targetPath, timeoutMs]);
}