/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sparkles, Heart, RefreshCw, ArchiveRestore, Check, Bookmark, Star, Calendar, MessageSquareQuote, Layers } from "lucide-react";
import { Fortune, FORTUNES } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface CookieWidgetProps {
  widgetOpacity: number;
  glassEffect: boolean;
}

interface TarotCard {
  id: string;
  name: string;
  emoji: string;
  keywords: string;
  advice: string;
}

const TAROT_CARDS: TarotCard[] = [
  {
    id: "the_star",
    name: "The Star",
    emoji: "⭐",
    keywords: "Hope, Faith, Serenity, Inspiration",
    advice: "A guiding light of alignment is shining upon your workspace. Trust the gentle path ahead.",
  },
  {
    id: "the_sun",
    name: "The Sun",
    emoji: "☀️",
    keywords: "Joy, Success, Vitality, Radiance",
    advice: "Abundant positive energy is radiating in your focus orbit today. Share your brilliance with the world.",
  },
  {
    id: "the_fool",
    name: "The Fool",
    emoji: "🃏",
    keywords: "New Beginnings, Freedom, Clean Slate",
    advice: "Embrace the beauty of starting fresh. A gorgeous, unscheduled flow is waiting for you.",
  },
  {
    id: "the_empress",
    name: "The Empress",
    emoji: "👑",
    keywords: "Abundance, Creativity, Nurturing",
    advice: "Your ideas are ready to bloom. Nurture what you love, write from the heart, and feel the flow.",
  },
  {
    id: "the_magician",
    name: "The Magician",
    emoji: "🪄",
    keywords: "Manifestation, Focus, Power",
    advice: "You have all tools required to complete your workspace goals today. Bring them to action.",
  },
  {
    id: "wheel_of_fortune",
    name: "Wheel of Fortune",
    emoji: "🎡",
    keywords: "Cycles, Destiny, Breakthrough",
    advice: "The celestial gears are turning in your favor today. Lean into the natural momentum of change.",
  },
  {
    id: "the_moon",
    name: "The Moon",
    emoji: "🌙",
    keywords: "Intuition, Dreams, Reflection",
    advice: "Pay close attention to your subtle dreams and insights. Rest and map out your thoughts.",
  },
  {
    id: "temperance",
    name: "Temperance",
    emoji: "🧪",
    keywords: "Balance, Alchemy, Calm Pacing",
    advice: "Blend your focus sessions with calm deep breaths. True progress lies in the harmony of moderation.",
  }
];

interface FunFact {
  id: string;
  text: string;
  category: string;
}

const FUN_FACTS: FunFact[] = [
  { id: "ff1", text: "Honey never spoils. You could eat 3,000-year-old Egyptian tomb honey safely!", category: "Nature" },
  { id: "ff2", text: "Wombat poop is cube-shaped, which stops it from rolling away so they can mark their territory.", category: "Nature" },
  { id: "ff3", text: "The first computer bug was an actual moth found trapped inside a machine by Grace Hopper in 1947.", category: "Technology" },
  { id: "ff4", text: "Bananas are berries botanically speaking, but strawberries are not!", category: "Science" },
  { id: "ff5", text: "Before erasers were invented, people used rolled-up pieces of white bread to rub out pencil marks.", category: "History" },
  { id: "ff6", text: "Octopuses have three hearts and blue blood due to copper-based hemocyanin.", category: "Nature" },
  { id: "ff7", text: "The original name of the Google search engine was BackRub!", category: "Technology" },
  { id: "ff8", text: "Astronauts can grow up to 2 inches taller during long missions due to spinal expansion in microgravity.", category: "Science" },
  { id: "ff9", text: "A day on Venus is longer than a year on Venus. It takes 243 Earth days to rotate once.", category: "Science" },
  { id: "ff10", text: "A single cloud can weigh more than 1 million pounds (over 500 tons)!", category: "Science" },
  { id: "ff11", text: "Shakespeare invented the word 'swagger' as well as 'fashionable' and 'lonely'.", category: "History" },
  { id: "ff12", text: "Sea otters hold hands while sleeping so they do not drift apart!", category: "Nature" },
  { id: "ff13", text: "The Mpemba effect is a thermodynamic mystery where hot water can sometimes freeze faster than cold water.", category: "Science" },
  { id: "ff14", text: "The moon has moonquakes caused by the gravitational pool of the earth.", category: "Science" },
  { id: "ff15", text: "Sloths can hold their breath longer than dolphins can—up to 40 minutes!", category: "Nature" }
];

export default function CookieWidget({ widgetOpacity, glassEffect }: CookieWidgetProps) {
  // Mode: "tarot" or "cookie"
  const [activeTab, setActiveTab] = useState<"tarot" | "cookie">("tarot");
  
  // Cookie states
  const [cookieState, setCookieState] = useState<"intact" | "breaking" | "broken">("intact");
  const [cookieMode, setCookieMode] = useState<"fortune" | "fact">("fortune");
  const [activeCategory, setActiveCategory] = useState<"motivation" | "study" | "love" | "funny" | "productivity">("motivation");
  const [currentFortune, setCurrentFortune] = useState<Fortune>(FORTUNES[0]);
  const [savedFortunes, setSavedFortunes] = useState<Fortune[]>(() => {
    return JSON.parse(localStorage.getItem("saved_fortunes") || "[]");
  });

  // Tarot states
  const [tarotState, setTarotState] = useState<"face-down" | "flipping" | "face-up">("face-down");
  const [currentTarot, setCurrentTarot] = useState<TarotCard>(TAROT_CARDS[0]);
  const [savedTarots, setSavedTarots] = useState<TarotCard[]>(() => {
    return JSON.parse(localStorage.getItem("saved_tarots") || "[]");
  });

  useEffect(() => {
    localStorage.setItem("saved_fortunes", JSON.stringify(savedFortunes));
  }, [savedFortunes]);

  useEffect(() => {
    localStorage.setItem("saved_tarots", JSON.stringify(savedTarots));
  }, [savedTarots]);

  const handleCrackCookie = () => {
    if (cookieState !== "intact") return;

    setCookieState("breaking");
    
    if (cookieMode === "fortune") {
      // Choose appropriate fortune categories
      const matchingFortunes = FORTUNES.filter((f) => f.category === activeCategory);
      const chosen = matchingFortunes[Math.floor(Math.random() * matchingFortunes.length)] || FORTUNES[0];
      setCurrentFortune(chosen);
    } else {
      // Choose random fun fact
      const chosenFact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
      setCurrentFortune({
        id: chosenFact.id,
        text: `💡 [Fun Fact] ${chosenFact.text}`,
        category: "funny"
      });
    }

    setTimeout(() => {
      setCookieState("broken");
    }, 850);
  };

  const handleResetCookie = () => {
    setCookieState("intact");
  };

  const handlePullTarot = () => {
    if (tarotState !== "face-down") return;

    setTarotState("flipping");
    const chosen = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
    setCurrentTarot(chosen);

    setTimeout(() => {
      setTarotState("face-up");
    }, 900);
  };

  const handleResetTarot = () => {
    setTarotState("face-down");
  };

  const handleToggleFavoriteFortune = () => {
    const isSaved = savedFortunes.some((f) => f.id === currentFortune.id);
    if (isSaved) {
      setSavedFortunes((prev) => prev.filter((f) => f.id !== currentFortune.id));
    } else {
      setSavedFortunes((prev) => [...prev, currentFortune]);
    }
  };

  const handleToggleFavoriteTarot = () => {
    const isSaved = savedTarots.some((t) => t.id === currentTarot.id);
    if (isSaved) {
      setSavedTarots((prev) => prev.filter((t) => t.id !== currentTarot.id));
    } else {
      setSavedTarots((prev) => [...prev, currentTarot]);
    }
  };

  const isCurrentFortuneSaved = savedFortunes.some((f) => f.id === currentFortune.id);
  const isCurrentTarotSaved = savedTarots.some((t) => t.id === currentTarot.id);

  const textPrimary = "text-slate-950 dark:text-stone-50 font-black";
  const textSecondary = "text-slate-900 dark:text-amber-200 font-black";
  const containerStyle = glassEffect
    ? "glass-frosted"
    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl";

  return (
    <div
      id="cookie-widget-container"
      className={`${containerStyle} p-4 shadow-xl shadow-black/5 text-slate-850 dark:text-white transition-all duration-300 flex flex-col h-full overflow-hidden`}
      style={{ opacity: widgetOpacity / 100 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5 select-none">
          <Sparkles className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: "12s" }} />
          <div>
            <h4 className={`text-xs uppercase tracking-widest leading-none ${textPrimary}`}>Tarot & Fortunes</h4>
            <span className={`text-[10px] mt-0.5 block ${textSecondary}`}>Daily mystical pull</span>
          </div>
        </div>

        {/* Tab switcher: Tarot or Cookie */}
        <div className="flex bg-slate-500/10 rounded-xl p-0.5 border border-slate-500/10">
          <button
            onClick={() => setActiveTab("tarot")}
            className={`px-2 py-1 rounded-lg text-[9px] font-extrabold tracking-wider transition-all cursor-pointer ${
              activeTab === "tarot"
                ? "bg-white dark:bg-slate-800 text-rose-500 shadow-sm"
                : "text-slate-500 dark:text-stone-300 hover:text-rose-400"
            }`}
          >
            🔮 Tarot
          </button>
          <button
            onClick={() => setActiveTab("cookie")}
            className={`px-2 py-1 rounded-lg text-[9px] font-extrabold tracking-wider transition-all cursor-pointer ${
              activeTab === "cookie"
                ? "bg-white dark:bg-slate-800 text-rose-500 shadow-sm"
                : "text-slate-500 dark:text-stone-300 hover:text-rose-400"
            }`}
          >
            🥠 Cookie
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 rounded-2xl relative bg-gradient-to-tr from-rose-500/5 to-amber-500/5 border border-slate-500/5 dark:border-white/5 min-h-[145px] overflow-hidden">
        
        {activeTab === "tarot" ? (
          /* ================== TAROT READING MODE ================== */
          <AnimatePresence mode="wait">
            {tarotState === "face-down" && (
              <motion.div
                key="face-down"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="flex flex-col items-center justify-center cursor-pointer group"
                onClick={handlePullTarot}
              >
                {/* Beautiful Mystic Tarot Card Back Side */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="w-18 h-28 bg-gradient-to-br from-indigo-950 to-purple-900 border-2 border-amber-400/80 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden group-hover:shadow-indigo-500/20"
                >
                  <div className="absolute inset-0.5 border border-amber-400/30 rounded-lg flex items-center justify-center">
                    <span className="text-xl text-amber-300 animate-pulse">🌟</span>
                  </div>
                  {/* Ornate corner decals */}
                  <div className="absolute top-1 left-1 text-[6px] text-amber-400/60">✦</div>
                  <div className="absolute top-1 right-1 text-[6px] text-amber-400/60">✦</div>
                  <div className="absolute bottom-1 left-1 text-[6px] text-amber-400/60">✦</div>
                  <div className="absolute bottom-1 right-1 text-[6px] text-amber-400/60">✦</div>
                </motion.div>
                <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase text-indigo-600 dark:text-indigo-400 mt-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full group-hover:scale-105 transition-transform">
                  Draw Cosmic Card
                </span>
              </motion.div>
            )}

            {tarotState === "flipping" && (
              <motion.div
                key="flipping"
                animate={{ rotateY: [0, 90, 180, 270, 360], scale: [1, 1.1, 1.12, 1.05, 1] }}
                transition={{ duration: 0.85 }}
                className="w-18 h-28 bg-gradient-to-br from-purple-900 to-indigo-950 border-2 border-amber-450 rounded-xl flex items-center justify-center shadow-2xl relative"
              >
                <span className="text-2xl text-amber-400 animate-ping">🔮</span>
              </motion.div>
            )}

            {tarotState === "face-up" && (
              <motion.div
                key="face-up"
                initial={{ transform: "rotateY(-180deg)", opacity: 0, scale: 0.9 }}
                animate={{ transform: "rotateY(0deg)", opacity: 1, scale: 1 }}
                className="w-full flex flex-col items-center gap-2"
              >
                {/* Visual Card Face Design */}
                <div className="flex items-center gap-3 bg-white/40 dark:bg-slate-900/60 border border-white/20 dark:border-slate-800 p-2.5 rounded-xl w-full">
                  <div className="w-11 h-16 bg-gradient-to-b from-amber-500/15 to-purple-500/10 border border-amber-450 rounded-lg flex items-center justify-center shadow-inner text-2xl">
                    {currentTarot.emoji}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <span className="text-[9px] font-mono uppercase bg-amber-500/10 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 font-extrabold px-1.5 py-0.5 rounded">
                      Major Arcana
                    </span>
                    <h5 className="font-extrabold text-xs text-slate-900 dark:text-white mt-1 leading-tight select-all">
                      {currentTarot.name}
                    </h5>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      🔑 {currentTarot.keywords}
                    </p>
                  </div>
                </div>

                {/* Advice Quote */}
                <div className="text-left text-[11px] leading-relaxed bg-amber-50 dark:bg-indigo-950/20 border-2 border-dashed border-amber-300 dark:border-indigo-500/20 text-stone-900 dark:text-stone-100 p-2.5 rounded-lg w-full relative">
                  <p className="italic font-serif">
                    "{currentTarot.advice}"
                  </p>
                </div>

                {/* Operations */}
                <div className="flex gap-1.5 w-full">
                  <button
                    onClick={handleToggleFavoriteTarot}
                    className={`flex-1 text-[10px] py-1 px-2 rounded-lg font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isCurrentTarotSaved
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-750 hover:bg-amber-500 hover:text-white"
                    }`}
                  >
                    <Star className={`w-3 h-3 ${isCurrentTarotSaved ? "fill-white" : ""}`} />
                    <span>Starred</span>
                  </button>

                  <button
                    onClick={handleResetTarot}
                    className="px-2.5 py-1 text-[10px] font-bold bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/15 rounded-lg text-slate-850 dark:text-white font-mono cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          /* ================== FORTUNE COOKIE MODE ================== */
          <AnimatePresence mode="wait">
            {cookieState === "intact" && (
              <motion.div
                key="intact"
                className="flex flex-col items-center justify-center cursor-pointer group"
                onClick={handleCrackCookie}
              >
                {/* Optional Mode Toggle */}
                <div className="flex bg-slate-500/10 rounded-lg p-0.5 border border-slate-500/10 mb-2.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCookieMode("fortune");
                    }}
                    className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                      cookieMode === "fortune"
                        ? "bg-white dark:bg-slate-800 text-rose-500 shadow-sm"
                        : "text-slate-500 dark:text-stone-300 hover:text-rose-400"
                    }`}
                  >
                    🔮 Fortune
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCookieMode("fact");
                    }}
                    className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                      cookieMode === "fact"
                        ? "bg-white dark:bg-slate-800 text-rose-500 shadow-sm"
                        : "text-slate-500 dark:text-stone-300 hover:text-rose-400"
                    }`}
                  >
                    🧠 Trivia
                  </button>
                </div>

                {cookieMode === "fortune" ? (
                  <select
                    value={activeCategory}
                    onChange={(e) => {
                      e.stopPropagation();
                      setActiveCategory(e.target.value as any);
                    }}
                    className="text-[9px] font-extrabold bg-slate-500/10 hover:bg-slate-500/20 text-slate-800 dark:text-white border border-slate-500/15 rounded-lg px-1.5 py-0.5 cursor-pointer outline-none mb-2.5"
                  >
                    <option value="motivation" className="bg-slate-900 text-white font-bold">Motivation ⭐</option>
                    <option value="study" className="bg-slate-900 text-white font-bold">Study 📚</option>
                    <option value="love" className="bg-slate-900 text-white font-bold">Comfort 🌸</option>
                    <option value="funny" className="bg-slate-900 text-white font-bold">Humor 😄</option>
                    <option value="productivity" className="bg-slate-900 text-white font-bold">Focus 🎯</option>
                  </select>
                ) : (
                  <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-400 mb-2.5 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded-full select-none">
                    💡 Trivia Facts
                  </span>
                )}

                <motion.div
                  whileHover={{ scale: 1.15, rotate: [0, -6, 6, -3, 3, 0] }}
                  transition={{ repeat: Infinity, repeatDelay: 1, duration: 1.5 }}
                  className="text-5xl drop-shadow-[0_10px_15px_rgba(245,158,11,0.25)] text-amber-400 select-none pb-2 text-center"
                >
                  🥠
                </motion.div>
                
                <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-600/20 px-3 py-1 rounded-full text-center group-hover:scale-105 transition-transform">
                  Crack Open
                </span>
              </motion.div>
            )}

            {cookieState === "breaking" && (
              <motion.div
                key="breaking"
                className="flex flex-col items-center justify-center relative"
              >
                <motion.div
                  animate={{ rotate: [0, -15, 15, -15, 15, 0], scale: [1, 1.1, 0.9, 1.1, 1] }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl select-none"
                >
                  🥠
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-3xl animate-ping opacity-75">✨</span>
                </div>
                <p className="text-[10px] uppercase font-bold text-amber-500 font-mono tracking-widest animate-pulse pt-2">
                  {cookieMode === "fact" ? "Baking fun facts..." : "Baking advice..."}
                </p>
              </motion.div>
            )}

            {cookieState === "broken" && (
              <motion.div
                key="broken"
                className="w-full flex flex-col items-center justify-between text-center gap-2 h-full py-0.5"
              >
                <div className="flex justify-center items-center gap-12 text-2xl opacity-60 select-none relative w-full mb-1">
                  <motion.span 
                    initial={{ x: -20, rotate: -15, opacity: 0 }}
                    animate={{ x: 0, rotate: -25, opacity: 1 }}
                    className="filter drop-shadow"
                  >
                    🥠
                  </motion.span>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[9px] font-mono tracking-widest font-extrabold text-amber-500 animate-pulse bg-white/10 dark:bg-black/20 px-2 py-0.5 rounded-full border border-amber-500/20">
                      BAKED
                    </span>
                  </div>
                  <motion.span 
                    initial={{ x: 20, rotate: 15, opacity: 0 }}
                    animate={{ x: 0, rotate: 25, opacity: 1 }}
                    className="filter drop-shadow scale-x-[-1]"
                  >
                    🥠
                  </motion.span>
                </div>

                <div className="bg-amber-50 border-2 border-dashed border-amber-300 text-stone-900 p-2.5 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.12)] max-w-xs relative w-full hover:rotate-1 transition-transform">
                  <p className="text-[11px] font-serif italic tracking-wide leading-relaxed pl-1 pr-1 text-left">
                    "{currentFortune.text}"
                  </p>
                </div>

                <div className="flex items-center gap-1.5 w-full mt-2">
                  <button
                    onClick={handleToggleFavoriteFortune}
                    className={`flex-1 text-[10px] py-1 px-2 rounded-lg font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isCurrentFortuneSaved
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-750 hover:bg-amber-500 hover:text-white"
                    }`}
                  >
                    <Star className={`w-3 h-3 ${isCurrentFortuneSaved ? "fill-white" : ""}`} />
                    <span>Starred</span>
                  </button>

                  <button
                    onClick={handleResetCookie}
                    className="px-2.5 py-1 text-[10px] font-bold bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/15 rounded-lg text-slate-850 dark:text-white font-mono cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Starred lists sliding drawer down the bottom */}
      {activeTab === "tarot" && savedTarots.length > 0 && (
        <div className="mt-2 text-left shrink-0 max-h-[40px] overflow-hidden select-none">
          <div className="flex justify-between items-center text-[9px] text-slate-550 dark:text-stone-400 uppercase tracking-widest font-mono font-black">
            <span>Starred Tarots ({savedTarots.length})</span>
            <button onClick={() => setSavedTarots([])} className="text-[8px] text-stone-400 hover:text-rose-500 transition-colors">Clear</button>
          </div>
          <div className="flex gap-1 overflow-x-auto py-1 custom-scrollbar scroll-smooth">
            {savedTarots.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setCurrentTarot(t);
                  setTarotState("face-up");
                }}
                className="shrink-0 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/15 px-1.5 py-0.5 rounded text-[9px] text-rose-600 dark:text-rose-300 font-bold hover:scale-102 transition-all cursor-pointer whitespace-nowrap"
              >
                {t.emoji} {t.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "cookie" && savedFortunes.length > 0 && (
        <div className="mt-2 text-left shrink-0 max-h-[40px] overflow-hidden select-none">
          <div className="flex justify-between items-center text-[9px] text-slate-550 dark:text-stone-400 uppercase tracking-widest font-mono font-black">
            <span>Starred Fortunes ({savedFortunes.length})</span>
            <button onClick={() => setSavedFortunes([])} className="text-[8px] text-stone-400 hover:text-rose-500 transition-colors">Clear</button>
          </div>
          <div className="flex gap-1 overflow-x-auto py-1 custom-scrollbar scroll-smooth">
            {savedFortunes.map((f) => (
              <div
                key={f.id}
                onClick={() => {
                  setCurrentFortune(f);
                  setCookieState("broken");
                }}
                className="shrink-0 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/15 px-1.5 py-0.5 rounded text-[9px] text-amber-600 dark:text-amber-300 font-bold hover:scale-102 transition-all cursor-pointer whitespace-nowrap"
              >
                🥠 "{f.text.slice(0, 10)}..."
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
