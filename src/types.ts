/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
}

export interface StickyNote {
  id: string;
  text: string;
  color: string;
  x: number; // percentage width for responsive absolute placement
  y: number; // percentage height for responsive absolute placement
  pinned: boolean;
  width: number;
  height: number;
  updatedAt: string;
}

export type ClockStyle = "glass" | "neon" | "minimal" | "retro";

export interface CustomSettings {
  wallpaperType: "image" | "live-stars" | "live-particles" | "live-aurora" | "gradient" | "live-frosted";
  wallpaperUrl: string;
  wallpaperOpacity: number;
  widgetOpacity: number;
  widgetGlassEffect: boolean;
  activeFont: "font-sans" | "font-mono" | "font-playfair" | "font-space" | "font-bubble";
  clockStyle: ClockStyle;
  enableRGB: boolean;
  soundscape: string; // sound identifier
  soundVolume: number;
  isSoundPlaying: boolean;
  dragEnabled?: boolean;
  widgetSizes?: { [widgetKey: string]: "small" | "medium" | "large" };
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  rainChance: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
}

export interface WellnessData {
  steps: number;
  goal: number;
  caloriesBurned: number;
  walkStreak: number;
  weightGainedLoss?: string;
  waterIntakeMl: number;
  waterGoalMl: number;
}

export interface Fortune {
  id: string;
  text: string;
  category: "motivation" | "study" | "love" | "funny" | "productivity";
  author?: string;
}

export interface SavedSetup {
  id: string;
  name: string;
  author: string;
  avatar: string;
  likes: number;
  isLikedByUser?: boolean;
  settings: CustomSettings;
  activeWidgets: { [key: string]: boolean };
  createdAt: string;
}

// Default Constants
export const PRESET_WALLPAPERS = [
  {
    id: "anime_sunset",
    name: "Anime Study Room",
    category: "anime",
    url: "/src/assets/images/cozy_study_anime_background_1779726119561.png",
  },
  {
    id: "misty_forest",
    name: "Misty Forest Dawn",
    category: "nature",
    url: "/src/assets/images/misty_forest_nature_background_1779726139632.png",
  },
  {
    id: "cyber_gaming",
    name: "Cyberpunk Lo-fi",
    category: "gaming",
    url: "/src/assets/images/cyberpunk_lofi_desk_background_1779726158317.png",
  },
  {
    id: "pastel_pink",
    name: "Pastel Cloud Dream",
    category: "pastel",
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1920",
  },
  {
    id: "warm_library",
    name: "Cozy Study Corner",
    category: "study",
    url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1920",
  },
  {
    id: "nordic_night",
    name: "Minimalist Dark Cabin",
    category: "dark mode",
    url: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1920",
  },
  {
    id: "minimal_beige",
    name: "Soft Sand Canvas",
    category: "minimalist",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920",
  }
];

export const FORTUNES: Fortune[] = [
  { id: "f1", text: "A small step today creates a monumental path tomorrow.", category: "productivity" },
  { id: "f2", text: "Your consistency will surprise you. Don't stop now!", category: "motivation" },
  { id: "f3", text: "Something wonderfully exciting is closer than you think.", category: "motivation" },
  { id: "f4", text: "Focus is not about doing everything; it is about choosing one true goal.", category: "productivity" },
  { id: "f5", text: "Resting is also step of your productivity journey.", category: "study" },
  { id: "f6", text: "An organized mind can conquer any difficult textbook.", category: "study" },
  { id: "f7", text: "Your dreams are listening to the effort you make today.", category: "love" },
  { id: "f8", text: "Error 404: Bad vibes not found. You are doing fantastic!", category: "funny" },
  { id: "f9", text: "The secret of getting ahead is simply starting.", category: "motivation" },
  { id: "f10", text: "May your coffee be strong and your compile times short.", category: "funny" },
  { id: "f11", text: "Study now, relax on your future superyacht later.", category: "study" },
  { id: "f12", text: "Taking care of your body is the ultimate investment.", category: "productivity" },
  { id: "f13", text: "A warm cup of tea and a blank todo page is pure magic.", category: "love" },
  { id: "f14", text: "Your progress is beautiful, even when you cannot see it yet.", category: "love" }
];

export const PRESET_SETUPS: SavedSetup[] = [
  {
    id: "setup_cozy",
    name: "Sunset Chills Room",
    author: "LoFiBunny",
    avatar: "🐰",
    likes: 1421,
    settings: {
      wallpaperType: "image",
      wallpaperUrl: "/src/assets/images/cozy_study_anime_background_1779726119561.png",
      wallpaperOpacity: 100,
      widgetOpacity: 85,
      widgetGlassEffect: true,
      activeFont: "font-space",
      clockStyle: "glass",
      enableRGB: false,
      soundscape: "lofi",
      soundVolume: 50,
      isSoundPlaying: false
    },
    activeWidgets: {
      clock: true,
      todo: true,
      notes: true,
      weather: true,
      tracker: true,
      cookie: true
    },
    createdAt: "2026-05-20"
  },
  {
    id: "setup_grid",
    name: "Midnight Coder",
    author: "Hex_Dev",
    avatar: "👻",
    likes: 938,
    settings: {
      wallpaperType: "image",
      wallpaperUrl: "/src/assets/images/cyberpunk_lofi_desk_background_1779726158317.png",
      wallpaperOpacity: 90,
      widgetOpacity: 75,
      widgetGlassEffect: true,
      activeFont: "font-mono",
      clockStyle: "neon",
      enableRGB: true,
      soundscape: "cyber",
      soundVolume: 30,
      isSoundPlaying: false
    },
    activeWidgets: {
      clock: true,
      todo: true,
      notes: false,
      weather: true,
      tracker: true,
      cookie: false
    },
    createdAt: "2026-05-24"
  },
  {
    id: "setup_misty",
    name: "Morning Whispers",
    author: "ForestWanderer",
    avatar: "🌲",
    likes: 672,
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
      soundVolume: 70,
      isSoundPlaying: false
    },
    activeWidgets: {
      clock: true,
      todo: true,
      notes: true,
      weather: true,
      tracker: true,
      cookie: true
    },
    createdAt: "2026-05-25"
  }
];
