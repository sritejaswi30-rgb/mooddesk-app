/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sliders, Sun, Moon, Volume2, VolumeX, Eye, Palette, Sparkles, Wand2, Download, Upload } from "lucide-react";
import { CustomSettings, PRESET_WALLPAPERS } from "../types";
import { cozySynth } from "../utils/audio";

interface CustomizerPanelProps {
  settings: CustomSettings;
  setSettings: React.Dispatch<React.SetStateAction<CustomSettings>>;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  activeWidgets: { [key: string]: boolean };
  setActiveWidgets: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

const FONTS_LIST = [
  { id: "font-sans", name: "Modern Sans (Inter)" },
  { id: "font-mono", name: "Technical Mono (JetBrains)" },
  { id: "font-playfair", name: "Editorial Serif (Playfair)" },
  { id: "font-space", name: "Futuristic Grotesque (Space)" },
  { id: "font-bubble", name: "Cozy Handdrawn (Outfit)" },
];

export default function CustomizerPanel({
  settings,
  setSettings,
  darkMode,
  setDarkMode,
  activeWidgets,
  setActiveWidgets,
}: CustomizerPanelProps) {
  const [soundscape, setSoundscape] = useState(settings.soundscape);
  const [isPlaying, setIsPlaying] = useState(settings.isSoundPlaying);
  const [volume, setVolume] = useState(settings.soundVolume);
  const [customInputUrl, setCustomInputUrl] = useState("");

  useEffect(() => {
    if (isPlaying) {
      cozySynth.startSound(soundscape, volume);
    } else {
      cozySynth.stopSound();
    }
    setSettings((prev) => ({
      ...prev,
      soundscape,
      soundVolume: volume,
      isSoundPlaying: isPlaying,
    }));
  }, [soundscape, isPlaying]);

  useEffect(() => {
    cozySynth.setVolume(volume);
  }, [volume]);

  // Clean exit soundscape
  useEffect(() => {
    return () => {
      cozySynth.stopSound();
    };
  }, []);

  const handleToggleSound = () => {
    setIsPlaying((prev) => !prev);
  };

  const handlePresetSelect = (url: string) => {
    setSettings((prev) => ({
      ...prev,
      wallpaperType: "image",
      wallpaperUrl: url,
    }));
  };

  const handleLiveTypeSelect = (type: CustomSettings["wallpaperType"]) => {
    setSettings((prev) => ({
      ...prev,
      wallpaperType: type,
    }));
  };

  const handleCustomWallpaperApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputUrl.trim()) return;

    setSettings((prev) => ({
      ...prev,
      wallpaperType: "image",
      wallpaperUrl: customInputUrl.trim(),
    }));
    setCustomInputUrl("");
  };

  const toggleWidget = (widgetKey: string) => {
    setActiveWidgets((prev) => ({
      ...prev,
      [widgetKey]: !prev[widgetKey],
    }));
  };

  const toggleGlass = () => {
    setSettings((prev) => ({
      ...prev,
      widgetGlassEffect: !prev.widgetGlassEffect,
    }));
  };

  const toggleRGB = () => {
    setSettings((prev) => ({
      ...prev,
      enableRGB: !prev.enableRGB,
    }));
  };

  const handleExportConfig = () => {
    try {
      const configObj = {
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        settings,
        activeWidgets,
        darkMode,
        todos: JSON.parse(localStorage.getItem("mooddesk_todos") || "[]"),
        notes: JSON.parse(localStorage.getItem("mooddesk_notes") || "[]"),
      };
      
      const fileData = JSON.stringify(configObj, null, 2);
      const blob = new Blob([fileData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `mooddesk-layout-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export setup configuration", err);
    }
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === "object") {
          if (parsed.settings) {
            localStorage.setItem("mooddesk_settings", JSON.stringify(parsed.settings));
          }
          if (parsed.activeWidgets) {
            localStorage.setItem("mooddesk_active_widgets", JSON.stringify(parsed.activeWidgets));
          }
          if (parsed.darkMode !== undefined) {
            localStorage.setItem("mooddesk_darkmode", JSON.stringify(parsed.darkMode));
          }
          if (Array.isArray(parsed.todos)) {
            localStorage.setItem("mooddesk_todos", JSON.stringify(parsed.todos));
          }
          if (Array.isArray(parsed.notes)) {
            localStorage.setItem("mooddesk_notes", JSON.stringify(parsed.notes));
          }
          
          window.location.reload();
        } else {
          alert("Invalid layout JSON format. Please try another file.");
        }
      } catch (err) {
        console.error("Failed to parse and import configuration", err);
        alert("Error parsing backup JSON file. Make sure it is a valid format.");
      }
    };
    fileReader.readAsText(files[0]);
  };

  return (
    <div
      id="customizer-panel-root"
      className="p-5 flex flex-col gap-5 text-slate-800 dark:text-slate-100 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl h-full overflow-y-auto custom-scrollbar"
    >
      {/* Title */}
      <div className="flex items-center gap-2">
        <Sliders className="w-5 h-5 text-rose-500" />
        <div>
          <h2 className="font-bold text-sm tracking-tight leading-tight">Mood Desk customization</h2>
          <p className="text-xs text-slate-800 dark:text-amber-200/90 font-bold">Design your personal digital workspace</p>
        </div>
      </div>

      {/* Toggles Core */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-500/5 transition-all text-xs font-bold flex items-center justify-center gap-1.5"
        >
          {darkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-500" /> Light Mode
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-rose-500" /> Dark Mode
            </>
          )}
        </button>

        <button
          onClick={toggleGlass}
          className={`p-2.5 rounded-xl border transition-all text-xs font-bold flex items-center justify-center gap-1.5 ${
            settings.widgetGlassEffect
              ? "bg-[#fda4af]/10 text-rose-500 border-rose-200"
              : "border-slate-200 dark:border-slate-800"
          }`}
        >
          🔮 Glass Effect {settings.widgetGlassEffect ? "ON" : "OFF"}
        </button>
      </div>

      {/* Preset Wallpapers Selectors */}
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-amber-100">
          Preset Cozy Wallpapers
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
          {PRESET_WALLPAPERS.map((wp) => (
            <button
              key={wp.id}
              onClick={() => handlePresetSelect(wp.url)}
              className="group relative h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 transition-all text-left"
            >
              <img
                src={wp.url}
                alt={wp.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1">
                <p className="text-[9px] font-semibold text-white truncate text-center">{wp.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live Animated Background chooser */}
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-amber-100">
          Live Animated Canvas Backgrounds
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => handleLiveTypeSelect("live-stars")}
            className={`py-1 px-1.5 rounded-lg border text-[10px] font-semibold hover:bg-slate-500/5 transition-all truncate text-center ${
              settings.wallpaperType === "live-stars"
                ? "bg-rose-500 text-white border-rose-500"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            ⭐ Starry Galaxy
          </button>

          <button
            onClick={() => handleLiveTypeSelect("live-particles")}
            className={`py-1 px-1.5 rounded-lg border text-[10px] font-semibold hover:bg-slate-500/5 transition-all truncate text-center ${
              settings.wallpaperType === "live-particles"
                ? "bg-rose-500 text-white border-rose-500"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            💫 Float Dust
          </button>

          <button
            onClick={() => handleLiveTypeSelect("live-aurora")}
            className={`py-1 px-1.5 rounded-lg border text-[10px] font-semibold hover:bg-slate-500/5 transition-all truncate text-center ${
              settings.wallpaperType === "live-aurora"
                ? "bg-rose-500 text-white border-rose-500"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            🌌 Aurora Rise
          </button>

          <button
            onClick={() => handleLiveTypeSelect("live-frosted")}
            className={`py-1 px-1.5 rounded-lg border text-[10px] font-semibold hover:bg-slate-500/5 transition-all truncate text-center ${
              settings.wallpaperType === "live-frosted"
                ? "bg-rose-500 text-white border-rose-500"
                : "border-slate-200 dark:border-slate-800 text-rose-500 bg-rose-500/5"
            }`}
          >
            ✨ Frosted Orbs
          </button>
        </div>
      </div>

      {/* Custom URL upload */}
      <form onSubmit={handleCustomWallpaperApply} className="space-y-1.5">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-amber-100">
          Custom Wallpaper URL
        </label>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={customInputUrl}
            onChange={(e) => setCustomInputUrl(e.target.value)}
            placeholder="Paste image URL (e.g. Unsplash)..."
            className="flex-1 text-xs bg-slate-500/5 py-1 px-2.5 rounded-xl border border-slate-500/15 focus:outline-none focus:border-rose-400 text-slate-800 dark:text-white"
          />
          <button
            type="submit"
            className="bg-slate-800 hover:bg-rose-500 text-white font-bold text-xs py-1 px-3.5 rounded-xl border border-slate-700 dark:bg-slate-800/80 transition-colors"
          >
            Apply
          </button>
        </div>
      </form>

      {/* Font Chooser */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-amber-100">
          Custom Desktop Typography
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {FONTS_LIST.map((f) => (
            <button
              key={f.id}
              onClick={() => setSettings((p) => ({ ...p, activeFont: f.id as any }))}
              className={`p-1.5 rounded-xl border text-[10px] text-left transition-all font-semibold ${
                settings.activeFont === f.id
                  ? "bg-rose-500 text-white border-rose-500"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Clock Style Choice */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-amber-100">
          Clock Widget Look
        </label>
        <div className="grid grid-cols-4 gap-1">
          {["glass", "neon", "minimal", "retro"].map((cs) => (
            <button
              key={cs}
              onClick={() => setSettings((p) => ({ ...p, clockStyle: cs as any }))}
              className={`py-1 rounded-lg border text-[10px] font-bold uppercase hover:scale-102 transition-all ${
                settings.clockStyle === cs
                  ? "bg-rose-500 text-white border-rose-500"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              {cs}
            </button>
          ))}
        </div>
      </div>

      {/* Sound Chooser */}
      <div className="space-y-2 bg-gradient-to-br from-pink-500/5 to-rose-500/5 p-3 rounded-2xl border border-rose-500/5 dark:border-white/5">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold text-rose-500 dark:text-rose-400 flex items-center gap-1">
            <Volume2 className="w-4 h-4 text-rose-500" /> Cozy Ambient Noise
          </label>

          <button
            onClick={handleToggleSound}
            className={`p-1 rounded-lg border transition-colors ${
              isPlaying ? "bg-rose-500 text-white border-rose-500" : "bg-black/5 dark:bg-white/5"
            }`}
          >
            {isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Noise preset selection */}
        <div className="grid grid-cols-3 gap-1.5 mb-2.5">
          {[
            { id: "rain", label: "Cozy Rain" },
            { id: "fire", label: "Fire Crackle" },
            { id: "space", label: "Space Drone" },
          ].map((snd) => (
            <button
              key={snd.id}
              onClick={() => {
                setSoundscape(snd.id);
                setIsPlaying(true);
              }}
              className={`py-1 px-1 rounded-lg border text-[10px] font-semibold text-center truncate ${
                soundscape === snd.id && isPlaying
                  ? "bg-rose-500 text-white border-rose-500"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 bg-white dark:bg-slate-800/80"
              }`}
            >
              {snd.label}
            </button>
          ))}
        </div>

        {/* Volume slider */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono opacity-65 shrink-0">Vol: {volume}%</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value, 10))}
            className="flex-1 accent-rose-500 h-1 bg-slate-200 rounded-full appearance-none outline-none dark:bg-slate-700"
          />
        </div>
      </div>

      {/* Widget Visibility Checklist */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-amber-100">
          Active Workspace Widgets
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.keys(activeWidgets).map((widgetKey) => (
            <button
               key={widgetKey}
               onClick={() => toggleWidget(widgetKey)}
               className={`py-1 px-2 text-[10px] font-semibold border rounded-xl flex items-center justify-between transition-all ${
                 activeWidgets[widgetKey]
                   ? "bg-[#fda4af]/10 text-rose-600 border-rose-200 dark:text-rose-450 dark:border-rose-950"
                   : "border-slate-200 dark:border-slate-800 text-slate-400"
               }`}
             >
              <span className="capitalize">{widgetKey} Widget</span>
              <span className={`w-1.5 h-1.5 rounded-full ${activeWidgets[widgetKey] ? "bg-rose-500" : "bg-slate-300"}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Draggable Layout & Sizing Adjuster */}
      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-rose-500" /> Free Drag Playground
            </h4>
            <p className="text-[9px] text-slate-400">Reposition items on screen</p>
          </div>
          <button
            onClick={() => {
              setSettings((prev) => ({
                ...prev,
                dragEnabled: !prev.dragEnabled,
              }));
            }}
            className={`px-3 py-1 text-xs font-mono font-bold rounded-full border transition-all ${
              settings.dragEnabled
                ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                : "border-slate-200 dark:border-slate-800 text-slate-400"
            }`}
          >
            {settings.dragEnabled ? "DRAG ON" : "LOCKED"}
          </button>
        </div>

        {/* Sizing dropdown selectors */}
        <div className="mt-3 space-y-2 bg-slate-550/5 dark:bg-white/5 p-3 rounded-2xl border border-slate-500/10">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 dark:text-amber-100 block">
            Resize Workspace Widgets
          </span>

          <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
            {Object.keys(activeWidgets).map((widgetKey) => {
              const currentSize = settings.widgetSizes?.[widgetKey] || "medium";
              return (
                <div key={widgetKey} className="flex items-center justify-between text-[11px]">
                  <span className="capitalize font-medium text-slate-600 dark:text-slate-300">{widgetKey}:</span>
                  <div className="flex gap-1">
                    {(["small", "medium", "large"] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => {
                          setSettings((prev) => {
                            const nextSizes = { ...prev.widgetSizes || {} };
                            nextSizes[widgetKey] = sz;
                            return {
                              ...prev,
                              widgetSizes: nextSizes,
                            };
                          });
                        }}
                        className={`px-1.5 py-0.5 text-[9px] font-bold rounded border capitalize transition-all ${
                          currentSize === sz
                            ? "bg-rose-500 text-white border-rose-500"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-750"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RGB Theme Selector */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#39ff14]" /> Cyber Neon Mode
          </h4>
          <p className="text-[9px] text-slate-400">Pulsing RGB atmospheric boundaries</p>
        </div>
        <button
          onClick={toggleRGB}
          className={`px-3 py-1 text-xs font-mono font-bold rounded-full border transition-all ${
            settings.enableRGB
              ? "bg-gradient-to-r from-emerald-400 via-pink-400 to-indigo-400 text-black font-extrabold border-transparent animate-pulse"
              : "border-slate-200 dark:border-slate-800 text-slate-400"
          }`}
        >
          {settings.enableRGB ? "ACTIVE" : "STANDBY"}
        </button>
      </div>

      {/* Slider Bars Opacity */}
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] font-black text-slate-900 dark:text-amber-100 uppercase tracking-wider">
          <span>Widget Glass Opacity</span>
          <span>{settings.widgetOpacity}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={settings.widgetOpacity}
          onChange={(e) =>
            setSettings((p) => ({ ...p, widgetOpacity: parseInt(e.target.value, 10) }))
          }
          className="w-full accent-rose-500 h-1 bg-slate-200 rounded-full appearance-none"
        />

        <div className="flex justify-between text-[11px] font-black text-slate-900 dark:text-amber-100 uppercase tracking-wider mt-2">
          <span>Wallpaper brightness</span>
          <span>{settings.wallpaperOpacity}%</span>
        </div>
        <input
          type="range"
          min="20"
          max="100"
          value={settings.wallpaperOpacity}
          onChange={(e) =>
            setSettings((p) => ({ ...p, wallpaperOpacity: parseInt(e.target.value, 10) }))
          }
          className="w-full accent-rose-500 h-1 bg-slate-200 rounded-full appearance-none"
        />
      </div>

      {/* Backup and Restore Workspace Setup */}
      <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <Download className="w-4 h-4 text-rose-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-stone-100">
            Backup & Restore Setup
          </h4>
        </div>
        <p className="text-[10px] font-bold leading-normal text-slate-900 dark:text-stone-100">
          Export your layout, themes, wallpaper config, active widgets, and user notes to a file, or upload a backup config to restore it.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExportConfig}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-[11px] transition-all shadow-sm cursor-pointer hover:scale-[1.02]"
          >
            <Download className="w-3.5 h-3.5" />
            Export Config
          </button>

          <label className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-200/55 hover:bg-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-stone-200 font-bold rounded-xl text-[11px] cursor-pointer border border-slate-200 dark:border-slate-750 transition-all shadow-sm hover:scale-[1.02]">
            <Upload className="w-3.5 h-3.5" />
            Import Config
            <input
              type="file"
              accept=".json"
              onChange={handleImportConfig}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
