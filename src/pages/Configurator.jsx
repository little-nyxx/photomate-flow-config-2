import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Zap, Sun, Home, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParameterToggle from "@/components/configurator/ParameterToggle";
import ScenarioDisplay from "@/components/configurator/ScenarioDisplay";
import VideoPlayer from "@/components/configurator/VideoPlayer";

const LOGO_URL = "https://media.base44.com/images/public/6a0abd7d4f23084851e1d83f/73fc7eace_generated_image.png";
const BG_URL = "https://media.base44.com/images/public/6a0abd7d4f23084851e1d83f/608797299_generated_image.png";

const PARAMETERS = [
  { key: "spot", label: "Cena na SPOT", icon: "💰" },
  { key: "vyroba", label: "Vlastní výroba", icon: "☀️" },
  { key: "spotreba", label: "Vlastní spotřeba", icon: "🏠" },
  { key: "teplota", label: "Venkovní teplota", icon: "🌡️" },
];

export default function Configurator() {
  const [params, setParams] = useState({ spot: 0, vyroba: 0, spotreba: 0, teplota: 0 });
  const [isPlaying, setIsPlaying] = useState(false);

  const code = `${params.spot}${params.vyroba}${params.spotreba}${params.teplota}`;

  const handleChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setParams({ spot: 0, vyroba: 0, spotreba: 0, teplota: 0 });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.07]"
        style={{ backgroundImage: `url(${BG_URL})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-screen p-6 lg:p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img src={LOGO_URL} alt="Photomate" className="h-12 object-contain" />
            <div className="h-8 w-px bg-border" />
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Konfigurátor toků energie
              </h1>
              <p className="text-xs text-muted-foreground">
                Interaktivní vizualizace energetických scénářů
              </p>
            </div>
          </div>
          <ScenarioDisplay code={code} />
        </header>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-5xl">
            {/* Parameter toggles */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-4 gap-6 mb-10"
            >
              {PARAMETERS.map((p, i) => (
                <motion.div
                  key={p.key}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="bg-card rounded-2xl p-6 shadow-sm border flex flex-col items-center"
                >
                  <ParameterToggle
                    label={p.label}
                    icon={p.icon}
                    value={params[p.key]}
                    onChange={(v) => handleChange(p.key, v)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-6"
            >
              <Button
                onClick={handleReset}
                variant="outline"
                className="h-16 px-10 text-base font-semibold rounded-2xl border-2 gap-3"
              >
                <RotateCcw className="h-5 w-5" />
                Resetovat vše
              </Button>
              <Button
                onClick={() => setIsPlaying(true)}
                className="h-16 px-14 text-lg font-bold rounded-2xl gap-3 shadow-lg shadow-primary/25"
              >
                <Play className="h-6 w-6" />
                Spustit scénář
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Photomate · Konfigurátor toků energie v{" "}
            <span className="font-mono">1.0</span>
          </p>
        </footer>
      </div>

      {/* Video Player overlay */}
      <VideoPlayer
        code={code}
        isPlaying={isPlaying}
        onClose={() => setIsPlaying(false)}
      />
    </div>
  );
}