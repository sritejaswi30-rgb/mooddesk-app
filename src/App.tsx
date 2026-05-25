/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  TodoItem,
  StickyNote,
  CustomSettings,
  PRESET_WALLPAPERS,
} from "./types";
import {
  Sparkles,
  Sliders,
  Share2,
  Volume2,
  VolumeX,
  Plus,
  Compass,
  Smile,
  Heart,
  Palette,
  LayoutGrid,
} from "lucide-react";

import AnimatedBackground from "./components/AnimatedBackground";
import ClockWidget from "./components/ClockWidget";
import TodoWidget from "./components/TodoWidget";
import NoteWidget from "./components/NoteWidget";
import WeatherWidget from "./components/WeatherWidget";
import WellnessWidget from "./components/WellnessWidget";
import CookieWidget from "./components/CookieWidget";
import CustomizerPanel from "./components/CustomizerPanel";
import CommunityPanel from "./components/CommunityPanel";
import { cozySynth } from "./utils/audio";
import { motion } from "motion/react";

export default function App() {
  // Load settings or seed defaults safely
  const [settings, setSettings] = useState<CustomSettings>(() => {
    const saved = localStorage.getItem("mooddesk_settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      wallpaperType: "live-frosted",
      wallpaperUrl: "/src/assets/images/cozy_study_anime_background_1779726119561.png",
      wallpaperOpacity: 100,
      widgetOpacity: 85,
      widgetGlassEffect: true,
      activeFont: "font-space",
      clockStyle: "glass",
      enableRGB: false,
      soundscape: "rain",
      soundVolume: 50,
      isSoundPlaying: false,
      dragEnabled: false,
      widgetSizes: {
        clock: "large",
        weather: "medium",
        notes: "medium",
        todo: "medium",
        tracker: "medium",
        cookie: "medium"
      }
    };
  });

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("mooddesk_darkmode");
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Fall back to system preference upon initial load
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  // Active Widgets Toggles
  const [activeWidgets, setActiveWidgets] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem("mooddesk_active_widgets");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      clock: true,
      todo: true,
      notes: true,
      weather: true,
      tracker: true,
      cookie: true,
    };
  });

  // To-Do list state
  const [todoItems, setTodoItems] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem("mooddesk_todos");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "t1",
        text: "Customize my first MoodDesk setup 🌸",
        completed: true,
        priority: "high",
        createdAt: new Date().toISOString(),
      },
      {
        id: "t2",
        text: "Crack open a comforting fortune cookie 🥠",
        completed: false,
        priority: "medium",
        createdAt: new Date().toISOString(),
      },
      {
        id: "t3",
        text: "Hydrate & walk 400 simulated steps 🦶",
        completed: false,
        priority: "low",
        createdAt: new Date().toISOString(),
      },
    ];
  });

  // Sticky notes state
  const [notes, setNotes] = useState<StickyNote[]>(() => {
    const saved = localStorage.getItem("mooddesk_notes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "n1",
        text: "Welcome to MoodDesk!\n\nThis is your customizable cozy sanctuary. Select wallpapers, synthesizers, fonts, and pets or write deep thoughts here! ✨",
        color: "#fef3c7", // amber yellow
        x: 40,
        y: 60,
        pinned: true,
        width: 180,
        height: 180,
        updatedAt: new Date().toISOString(),
      }
    ];
  });

  // Sidebar Toggling Control ("customizer" | "community" | "none")
  const [activeSidebar, setActiveSidebar] = useState<"customizer" | "community" | "none">("none");

  // Save changes to localStorage periodically
  useEffect(() => {
    localStorage.setItem("mooddesk_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("mooddesk_darkmode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("mooddesk_active_widgets", JSON.stringify(activeWidgets));
  }, [activeWidgets]);

  useEffect(() => {
    localStorage.setItem("mooddesk_todos", JSON.stringify(todoItems));
  }, [todoItems]);

  useEffect(() => {
    localStorage.setItem("mooddesk_notes", JSON.stringify(notes));
  }, [notes]);

  // Synchronize audio playing state if setting changes from customiser
  const handleToggleAmbientAudio = () => {
    setSettings((prev) => {
      const nextPlay = !prev.isSoundPlaying;
      if (nextPlay) {
        cozySynth.startSound(prev.soundscape, prev.soundVolume);
      } else {
        cozySynth.stopSound();
      }
      return { ...prev, isSoundPlaying: nextPlay };
    });
  };

  // Callback to adopt templates shared by other community members
  const handleApplyPresetFeed = (targetSettings: CustomSettings, targetActive: { [key: string]: boolean }, presetDarkMode?: boolean) => {
    setSettings(targetSettings);
    setActiveWidgets(targetActive);
    if (presetDarkMode !== undefined) {
      setDarkMode(presetDarkMode);
    }
    // Restart active synthesizer if template has sound playing
    if (targetSettings.isSoundPlaying) {
      cozySynth.startSound(targetSettings.soundscape, targetSettings.soundVolume);
    } else {
      cozySynth.stopSound();
    }
  };

  const getWidgetClasses = (key: string) => {
    const size = settings.widgetSizes?.[key] || "medium";
    const rgbClass = settings.enableRGB ? "rgb-active bg-black" : "";
    
    switch (key) {
      case "clock":
        if (size === "small") return `col-span-1 h-[170px] ${rgbClass}`;
        if (size === "large") return `col-span-1 md:col-span-2 lg:col-span-3 h-[250px] ${rgbClass}`;
        return `col-span-1 md:col-span-2 h-[220px] ${rgbClass}`;
      case "weather":
        if (size === "small") return `col-span-1 h-[170px] ${rgbClass}`;
        if (size === "large") return `col-span-1 md:col-span-2 h-[240px] ${rgbClass}`;
        return `col-span-1 h-[220px] ${rgbClass}`;
      case "notes":
        if (size === "small") return `col-span-1 h-[250px] ${rgbClass}`;
        if (size === "large") return `col-span-1 md:col-span-2 h-[410px] ${rgbClass}`;
        return `col-span-1 md:col-span-2 lg:col-span-1 h-[340px] ${rgbClass}`;
      case "todo":
        if (size === "small") return `col-span-1 h-[250px] ${rgbClass}`;
        if (size === "large") return `col-span-1 md:col-span-2 h-[410px] ${rgbClass}`;
        return `col-span-1 md:col-span-1 lg:col-span-1 h-[340px] ${rgbClass}`;
      case "tracker":
        if (size === "small") return `col-span-1 h-[250px] ${rgbClass}`;
        if (size === "large") return `col-span-1 md:col-span-2 h-[410px] ${rgbClass}`;
        return `col-span-1 md:col-span-1 lg:col-span-1 h-[340px] ${rgbClass}`;
      case "cookie":
        if (size === "small") return `col-span-1 h-[190px] ${rgbClass}`;
        if (size === "large") return `col-span-1 md:col-span-2 h-[330px] ${rgbClass}`;
        return `col-span-1 h-[270px] ${rgbClass}`;
      default:
        return `col-span-1 h-[270px] ${rgbClass}`;
    }
  };

  // Dynamic contrast helpers for outside page labels (headers, theme bar) to keep them highly readable on rich wallpapers
  // Helper function to dynamically calculate whether the current wallpaper backdrop is light or dark (luminance-based contrast safety)
  const isWallpaperLight = (): boolean => {
    const type = settings.wallpaperType;
    const url = settings.wallpaperUrl || "";

    if (type === "gradient") return true; // Light pastel gradient
    if (type === "live-particles") return true; // Soft warm pastel golden/beige background

    // Dark-themed animated canvas backgrounds
    if (type === "live-stars" || type === "live-aurora" || type === "live-frosted") {
      return false;
    }

    // Try parsing hex color strings (e.g. #ffffff or #333333 or custom color settings)
    const hexMatch = url.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (hexMatch) {
      const r = parseInt(hexMatch[1], 16);
      const g = parseInt(hexMatch[2], 16);
      const b = parseInt(hexMatch[3], 16);
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return luma > 128;
    }

    const shortHexMatch = url.match(/^#?([a-f\d])([a-f\d])([a-f\d])$/i);
    if (shortHexMatch) {
      const r = parseInt(shortHexMatch[1] + shortHexMatch[1], 16);
      const g = parseInt(shortHexMatch[2] + shortHexMatch[2], 16);
      const b = parseInt(shortHexMatch[3] + shortHexMatch[3], 16);
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return luma > 128;
    }

    const lowercaseUrl = url.toLowerCase();

    // Check pre-defined wallpaper presets & known unsplash image IDs to classify luminance accurately
    if (lowercaseUrl.includes("pastel") || lowercaseUrl.includes("photo-1541701494587")) return true; // Pastel Cloud Dream template (very light)
    if (lowercaseUrl.includes("beige") || lowercaseUrl.includes("photo-1618005182384")) return true;   // Soft Sand Canvas template (very light)
    if (lowercaseUrl.includes("misty_forest") || lowercaseUrl.includes("misty")) return true;           // Misty Forest Dawn (light fog)

    if (lowercaseUrl.includes("nordic_night") || lowercaseUrl.includes("photo-1518156677180")) return false; // Dark Cabin preset
    if (lowercaseUrl.includes("cyberpunk") || lowercaseUrl.includes("cyber_gaming")) return false;           // Dark Gaming setup preset
    if (lowercaseUrl.includes("cozy_study") || lowercaseUrl.includes("anime_sunset")) return false;         // Anime Study Room sunset
    if (lowercaseUrl.includes("library") || lowercaseUrl.includes("photo-1507842217343")) return false;       // Dark cozy wood library room

    // General string matching heuristics for custom user wallpaper URLs
    const lightKeywords = [
      "light", "white", "bright", "sky", "day", "pastel", "beige", "sand", "snow", 
      "mist", "cream", "pale", "sunshine", "sun", "cloud", "paper", "yellow", "fog", "dawn", "clear"
    ];
    const darkKeywords = [
      "dark", "night", "black", "shadow", "cyberpunk", "midnight", "forest", "space", 
      "galaxy", "neon", "sunset", "dusk", "evening", "charcoal", "obsidian", "navy", "abyss", "coal"
    ];

    for (const kw of lightKeywords) {
      if (lowercaseUrl.includes(kw)) return true;
    }
    for (const kw of darkKeywords) {
      if (lowercaseUrl.includes(kw)) return false;
    }

    // Default fallback to !darkMode representing general workspace background behavior
    return !darkMode;
  };

  const isContrastDarkNeeded = isWallpaperLight();
  
  const headingText = isContrastDarkNeeded 
    ? "text-slate-950 font-black tracking-tight text-contrast-safe-light" 
    : "text-white text-contrast-safe font-black tracking-tight";
  
  const subtitleText = isContrastDarkNeeded 
    ? "text-slate-900 font-extrabold tracking-wide text-contrast-safe-light" 
    : "text-amber-100 text-contrast-safe font-extrabold tracking-wide";
  
  const labelText = isContrastDarkNeeded 
    ? "text-slate-950 font-black tracking-wide text-contrast-safe-light" 
    : "text-yellow-100 text-contrast-safe font-extrabold tracking-wide";

  return (
    <div
      id="mooddesk-workspace-root"
      className={`min-h-screen relative overflow-x-hidden ${settings.activeFont || "font-sans"} ${
        darkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-950"
      }`}
    >
      {/* 1. Full Screen Wallpaper Background with Smooth Canvas Overlay */}
      <AnimatedBackground
        type={settings.wallpaperType}
        imageUrl={settings.wallpaperUrl}
        opacity={settings.wallpaperOpacity}
      />

      {/* 2. Sleek Custom Header Bar */}
      <header className="relative z-10 w-full px-5 py-3.5 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-white/10 dark:bg-slate-950/20">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌸</span>
          <div>
            <h1 className={`text-sm tracking-tight leading-tight flex items-center gap-1 ${headingText}`}>
              MoodDesk <span className="opacity-70 text-[10px] font-normal font-mono bg-black/10 dark:bg-white/10 px-1.5 rounded uppercase">Workspace</span>
            </h1>
            <p className={`text-[11px] leading-none ${subtitleText}`}>Your cozy digital sanctuary shop</p>
          </div>
        </div>

        {/* Ambient Soundscape Controller Capsule */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-500/10 dark:bg-white/5 border border-stone-400/20 rounded-2xl px-3 shadow-inner">
          <button
            onClick={handleToggleAmbientAudio}
            className={`p-1.5 rounded-full shadow-inner transition-transform active:scale-90 ${
              settings.isSoundPlaying ? "bg-rose-500 text-white animate-bounce" : "text-slate-500"
            }`}
            title="Toggle Cozy Noise Synthesizer"
          >
            {settings.isSoundPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          
          <div className="hidden sm:block text-left select-none">
            <span className={`text-[10px] uppercase block leading-none ${subtitleText}`}>Soundscape</span>
            <span className={`text-[10px] font-bold font-mono leading-tight ${labelText}`}>
              {settings.isSoundPlaying ? `${settings.soundscape.toUpperCase()} SYNTH` : "SILENT CHILL"}
            </span>
          </div>
        </div>

        {/* Sidebar buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSidebar((prev) => (prev === "customizer" ? "none" : "customizer"))}
            className={`p-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all ${
              activeSidebar === "customizer"
                ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/10"
                : "bg-white/70 hover:bg-white border-slate-200 text-slate-700 dark:bg-slate-900/60 dark:border-slate-850 dark:text-slate-300 dark:hover:bg-slate-900"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Design Desk</span>
          </button>

          <button
            onClick={() => setActiveSidebar((prev) => (prev === "community" ? "none" : "community"))}
            className={`p-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all ${
              activeSidebar === "community"
                ? "bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/10"
                : "bg-white/70 hover:bg-white border-slate-200 text-slate-700 dark:bg-slate-900/60 dark:border-slate-850 dark:text-slate-300 dark:hover:bg-slate-900"
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Layout Hub</span>
          </button>
        </div>
      </header>

      {/* Dynamic Theme Presets Gallery Strip bar */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-white/10 dark:bg-slate-950/40 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <span className="text-base">🎨</span>
            <div>
              <h3 className={`text-xs leading-tight ${headingText}`}>Theme Desk Presets</h3>
              <p className={`text-[10px] font-bold ${subtitleText}`}>Transform your entire workspace in one click</p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-1 pr-1 scrollbar-none scroll-smooth">
            {[
              {
                id: "sunset_lofi",
                name: "🌅 Sunset Cozy Room",
                darkMode: true,
                settings: {
                  wallpaperType: "image",
                  wallpaperUrl: "/src/assets/images/cozy_study_anime_background_1779726119561.png",
                  wallpaperOpacity: 100,
                  widgetOpacity: 90,
                  widgetGlassEffect: true,
                  activeFont: "font-space",
                  clockStyle: "glass",
                  enableRGB: false,
                  soundscape: "lofi",
                  soundVolume: 50,
                  isSoundPlaying: false,
                  dragEnabled: false,
                  widgetSizes: { clock: "large", weather: "medium", notes: "medium", todo: "medium", tracker: "medium", cookie: "medium" }
                },
                active: { clock: true, todo: true, notes: true, weather: true, tracker: true, cookie: true }
              },
              {
                id: "cyber_neon",
                name: "👾 Cyberpunk Neon",
                darkMode: true,
                settings: {
                  wallpaperType: "image",
                  wallpaperUrl: "/src/assets/images/cyberpunk_lofi_desk_background_1779726158317.png",
                  wallpaperOpacity: 95,
                  widgetOpacity: 75,
                  widgetGlassEffect: true,
                  activeFont: "font-mono",
                  clockStyle: "neon",
                  enableRGB: true,
                  soundscape: "cyber",
                  soundVolume: 40,
                  isSoundPlaying: false,
                  dragEnabled: false,
                  widgetSizes: { clock: "large", weather: "small", notes: "large", todo: "medium", tracker: "medium", cookie: "small" }
                },
                active: { clock: true, todo: true, notes: true, weather: true, tracker: true, cookie: false }
              },
              {
                id: "misty_wood",
                name: "🌲 Forest Dawn Whispers",
                darkMode: true,
                settings: {
                  wallpaperType: "image",
                  wallpaperUrl: "/src/assets/images/misty_forest_nature_background_1779726139632.png",
                  wallpaperOpacity: 100,
                  widgetOpacity: 90,
                  widgetGlassEffect: true,
                  activeFont: "font-playfair",
                  clockStyle: "minimal",
                  enableRGB: false,
                  soundscape: "forest",
                  soundVolume: 60,
                  isSoundPlaying: false,
                  dragEnabled: false,
                  widgetSizes: { clock: "medium", weather: "medium", notes: "medium", todo: "medium", tracker: "medium", cookie: "medium" }
                },
                active: { clock: true, todo: true, notes: true, weather: true, tracker: true, cookie: true }
              },
              {
                id: "pastel_dream",
                name: "☁️ Pastel Air Dream",
                darkMode: false,
                settings: {
                  wallpaperType: "image",
                  wallpaperUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1920",
                  wallpaperOpacity: 100,
                  widgetOpacity: 90,
                  widgetGlassEffect: true,
                  activeFont: "font-sans",
                  clockStyle: "glass",
                  enableRGB: false,
                  soundscape: "rain",
                  soundVolume: 50,
                  isSoundPlaying: false,
                  dragEnabled: false,
                  widgetSizes: { clock: "large", weather: "medium", notes: "medium", todo: "medium", tracker: "medium", cookie: "medium" }
                },
                active: { clock: true, todo: true, notes: true, weather: true, tracker: true, cookie: true }
              },
              {
                id: "frosted_minimal",
                name: "❄️ Frosted Aurora Aura",
                darkMode: true,
                settings: {
                  wallpaperType: "live-frosted",
                  wallpaperUrl: "",
                  wallpaperOpacity: 100,
                  widgetOpacity: 85,
                  widgetGlassEffect: true,
                  activeFont: "font-sans",
                  clockStyle: "minimal",
                  enableRGB: false,
                  soundscape: "rain",
                  soundVolume: 40,
                  isSoundPlaying: false,
                  dragEnabled: false,
                  widgetSizes: { clock: "medium", weather: "medium", notes: "medium", todo: "medium", tracker: "medium", cookie: "medium" }
                },
                active: { clock: true, todo: true, notes: true, weather: true, tracker: true, cookie: true }
              }
            ].map((theme) => {
              const isCurrent = settings.wallpaperUrl === theme.settings.wallpaperUrl && settings.clockStyle === theme.settings.clockStyle && settings.wallpaperType === theme.settings.wallpaperType;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleApplyPresetFeed(theme.settings as any, theme.active, theme.darkMode)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-full whitespace-nowrap transition-all border flex items-center gap-1 cursor-pointer ${
                    isCurrent
                      ? "bg-rose-500 text-white border-rose-500 shadow-md scale-102"
                      : "bg-white/10 hover:bg-white/20 border-white/15 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <span>{theme.name}</span>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white block animate-ping" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Grid Canvas */}
      <main className="relative z-10 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main widgets area taking up 8 columns if sidebar is none, otherwise shrinks relative */}
          <div className={`col-span-1 lg:col-span-12 ${activeSidebar !== "none" ? "lg:col-span-8" : ""} transition-all duration-305`}>
            
            {/* Elegant Responsive Bento Grid Layout */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${settings.dragEnabled ? "cursor-grab active:cursor-grabbing" : ""}`}>
              
              {/* Digital Clock Widget Card */}
              {activeWidgets.clock && (
                <motion.div
                  drag={settings.dragEnabled || false}
                  dragMomentum={false}
                  dragElastic={0.02}
                  className={`${getWidgetClasses("clock")} widget-text-shadow-safe ${settings.dragEnabled ? "ring-2 ring-rose-500/20 hover:scale-[1.01] transition-shadow duration-300" : ""}`}
                >
                  <ClockWidget
                    style={settings.clockStyle}
                    widgetOpacity={settings.widgetOpacity}
                    glassEffect={settings.widgetGlassEffect}
                  />
                </motion.div>
              )}

              {/* Weather Widget Card */}
              {activeWidgets.weather && (
                <motion.div
                  drag={settings.dragEnabled || false}
                  dragMomentum={false}
                  dragElastic={0.02}
                  className={`${getWidgetClasses("weather")} widget-text-shadow-safe ${settings.dragEnabled ? "ring-2 ring-rose-500/20 hover:scale-[1.01] transition-shadow duration-300" : ""}`}
                >
                  <WeatherWidget
                    widgetOpacity={settings.widgetOpacity}
                    glassEffect={settings.widgetGlassEffect}
                  />
                </motion.div>
              )}

              {/* Sticky Notes Widget Card */}
              {activeWidgets.notes && (
                <motion.div
                  drag={settings.dragEnabled || false}
                  dragMomentum={false}
                  dragElastic={0.02}
                  className={`${getWidgetClasses("notes")} widget-text-shadow-safe ${settings.dragEnabled ? "ring-2 ring-rose-500/20 hover:scale-[1.01] transition-shadow duration-300" : ""}`}
                >
                  <NoteWidget
                    notes={notes}
                    setNotes={setNotes}
                    widgetOpacity={settings.widgetOpacity}
                    glassEffect={settings.widgetGlassEffect}
                  />
                </motion.div>
              )}

              {/* Daily Goals / To-Do tasks List Card */}
              {activeWidgets.todo && (
                <motion.div
                  drag={settings.dragEnabled || false}
                  dragMomentum={false}
                  dragElastic={0.02}
                  className={`${getWidgetClasses("todo")} widget-text-shadow-safe ${settings.dragEnabled ? "ring-2 ring-rose-500/20 hover:scale-[1.01] transition-shadow duration-300" : ""}`}
                >
                  <TodoWidget
                    todoItems={todoItems}
                    setTodoItems={setTodoItems}
                    widgetOpacity={settings.widgetOpacity}
                    glassEffect={settings.widgetGlassEffect}
                  />
                </motion.div>
              )}

              {/* Steps & Water Tracker Card */}
              {activeWidgets.tracker && (
                <motion.div
                  drag={settings.dragEnabled || false}
                  dragMomentum={false}
                  dragElastic={0.02}
                  className={`${getWidgetClasses("tracker")} widget-text-shadow-safe ${settings.dragEnabled ? "ring-2 ring-rose-500/20 hover:scale-[1.01] transition-shadow duration-300" : ""}`}
                >
                  <WellnessWidget
                    widgetOpacity={settings.widgetOpacity}
                    glassEffect={settings.widgetGlassEffect}
                  />
                </motion.div>
              )}

              {/* Fortune Cookie Card */}
              {activeWidgets.cookie && (
                <motion.div
                  drag={settings.dragEnabled || false}
                  dragMomentum={false}
                  dragElastic={0.02}
                  className={`${getWidgetClasses("cookie")} widget-text-shadow-safe ${settings.dragEnabled ? "ring-2 ring-rose-500/20 hover:scale-[1.01] transition-shadow duration-300" : ""}`}
                >
                  <CookieWidget
                    widgetOpacity={settings.widgetOpacity}
                    glassEffect={settings.widgetGlassEffect}
                  />
                </motion.div>
              )}

            </div>
          </div>

          {/* 4. Sliding-In Sidebar Panels (Design Customizer or Community feeds Hub) */}
          {activeSidebar !== "none" && (
            <div className="col-span-1 lg:col-span-4 h-[640px] md:h-[750px] animate-slide-in relative">
              {activeSidebar === "customizer" ? (
                <CustomizerPanel
                  settings={settings}
                  setSettings={setSettings}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  activeWidgets={activeWidgets}
                  setActiveWidgets={setActiveWidgets}
                />
              ) : (
                <CommunityPanel
                  currentSettings={settings}
                  currentActiveWidgets={activeWidgets}
                  onApplyPreset={handleApplyPresetFeed}
                />
              )}
            </div>
          )}

        </div>
      </main>

      {/* Floating Sparkles indicator on empty outer fields */}
      <footer className={`relative z-10 w-full py-6 text-center text-[11px] select-none font-mono tracking-widest mt-12 ${labelText}`}>
        <p>MOODDESK SANCTUARY • CRAFTED WITH COZY VIBES IN 2026</p>
      </footer>
    </div>
  );
}
