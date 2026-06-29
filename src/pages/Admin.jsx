import React, { useState } from "react";
import { Lock, LogOut, ShieldCheck, Eye, EyeOff } from "lucide-react";
import CircleEditor from "@/components/admin/CircleEditor";
import VideoEditor from "@/components/admin/VideoEditor";
import BackgroundEditor from "@/components/admin/BackgroundEditor";
import ConfiguratorEditor from "@/components/admin/ConfiguratorEditor";
import ButtonLabelsEditor from "@/components/admin/ButtonLabelsEditor";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import EditLanguageSwitcher from "@/components/admin/EditLanguageSwitcher";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "photomate,Admin,2026";
const SESSION_KEY = "photomate_admin_auth";

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "true");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState("circles");
  const { t } = useLanguage();
  const [editLang, setEditLang] = useState("cs");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setAuthed(true);
      setError("");
    } else {
      setError(t('admin_login_error'));
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setUsername("");
    setPassword("");
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-sm text-white/50 mt-1">Photomate Flow Admin</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder={t('admin_username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-primary"
              autoComplete="off"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t('admin_password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-opacity"
            >
              {t('admin_login_btn')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm font-medium whitespace-nowrap">Edit page:</span>
              <EditLanguageSwitcher value={editLang} onChange={setEditLang} />
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold">Admin Panel</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {t('admin_logout')}
            </button>
          </div>
        </div>
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("circles")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${tab === "circles" ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20"}`}
          >
            {t('admin_tab_circles')}
          </button>
          <button
            onClick={() => setTab("videos")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${tab === "videos" ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20"}`}
          >
            {t('admin_tab_videos')}
          </button>
          <button
            onClick={() => setTab("backgrounds")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${tab === "backgrounds" ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20"}`}
          >
            {t('admin_tab_backgrounds')}
          </button>
          <button
            onClick={() => setTab("configurator")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${tab === "configurator" ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20"}`}
          >
            Configurator
          </button>
          <button
            onClick={() => setTab("buttons")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${tab === "buttons" ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20"}`}
          >
            {t('admin_tab_buttons')}
          </button>
          </div>
          {tab === "circles" ? <CircleEditor editLang={editLang} /> : tab === "videos" ? <VideoEditor /> : tab === "configurator" ? <ConfiguratorEditor /> : tab === "buttons" ? <ButtonLabelsEditor editLang={editLang} /> : <BackgroundEditor />}
      </div>
    </div>
  );
}