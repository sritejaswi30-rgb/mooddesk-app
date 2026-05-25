/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { MessageSquare, Heart, Bookmark, Upload, Sparkles, Check, Share2, PlusCircle } from "lucide-react";
import { SavedSetup, CustomSettings, PRESET_SETUPS } from "../types";

interface CommunityPanelProps {
  currentSettings: CustomSettings;
  currentActiveWidgets: { [key: string]: boolean };
  onApplyPreset: (settings: CustomSettings, activeWidgets: { [key: string]: boolean }, darkMode?: boolean) => void;
}

export default function CommunityPanel({
  currentSettings,
  currentActiveWidgets,
  onApplyPreset,
}: CommunityPanelProps) {
  const [setupsList, setSetupsList] = useState<SavedSetup[]>(() => {
    const saved = localStorage.getItem("community_setups");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return PRESET_SETUPS;
  });

  const [publishName, setPublishName] = useState("");
  const [publishAuthor, setPublishAuthor] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    localStorage.setItem("community_setups", JSON.stringify(setupsList));
  }, [setupsList]);

  const handleLikeSetup = (id: string) => {
    setSetupsList((prev) =>
      prev.map((setup) => {
        if (setup.id === id) {
          const isLiked = setup.isLikedByUser;
          return {
            ...setup,
            likes: isLiked ? setup.likes - 1 : setup.likes + 1,
            isLikedByUser: !isLiked,
          };
        }
        return setup;
      })
    );
  };

  const handlePublishSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishName.trim() || !publishAuthor.trim()) return;

    const newSetup: SavedSetup = {
      id: "setup_" + Date.now().toString(),
      name: publishName.trim(),
      author: publishAuthor.trim(),
      avatar: ["🦊", "🐼", "🦁", "🐰", "🐥", "👾", "🥑"][Math.floor(Math.random() * 7)],
      likes: 1,
      isLikedByUser: true,
      settings: currentSettings,
      activeWidgets: currentActiveWidgets,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setSetupsList((prev) => [newSetup, ...prev]);
    setPublishName("");
    setPublishAuthor("");
    setSuccessMsg("Layout setup shared successfully! Check the feed below.");
    setTimeout(() => {
      setSuccessMsg("");
    }, 3000);
  };

  return (
    <div
      id="community-panel-root"
      className="p-5 flex flex-col gap-5 text-slate-800 dark:text-slate-100 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl h-full overflow-y-auto custom-scrollbar"
    >
      {/* Title */}
      <div className="flex items-center gap-2">
        <Share2 className="w-5 h-5 text-indigo-500 animate-pulse" />
        <div>
          <h2 className="font-bold text-sm tracking-tight leading-tight">MoodDesk Hub Community</h2>
          <p className="text-xs text-slate-800 dark:text-amber-250 font-bold">Discover and adopt setups made by others</p>
        </div>
      </div>

      {/* Form: Publish Current Setup Layout */}
      <div className="bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10">
        <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mb-2.5">
          <Upload className="w-3.5 h-3.5" /> Share My Current Setup
        </h4>

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-2 rounded-xl text-[10px] font-semibold text-center mb-2 animate-fade-in">
            {successMsg}
          </div>
        )}

        <form onSubmit={handlePublishSetup} className="space-y-2 text-xs">
          <div>
            <label className="text-[9px] font-black text-slate-700 dark:text-amber-100 block uppercase mb-1">
              Setup Workspace Name
            </label>
            <input
              type="text"
              value={publishName}
              onChange={(e) => setPublishName(e.target.value)}
              placeholder="e.g. Cozy Sunset Study Space..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-1 px-2.5 focus:outline-none focus:border-indigo-400 text-[11px] text-slate-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="text-[9px] font-black text-slate-700 dark:text-amber-100 block uppercase mb-1">
              Your Nickname / Tag
            </label>
            <input
              type="text"
              value={publishAuthor}
              onChange={(e) => setPublishAuthor(e.target.value)}
              placeholder="e.g. LofiCoder..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-1 px-2.5 focus:outline-none focus:border-indigo-400 text-[11px] text-slate-800 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full font-bold bg-indigo-500 hover:bg-indigo-600 shadow-md shadow-indigo-500/10 text-white rounded-xl py-1.5 transition-all text-center flex items-center justify-center gap-1 text-[11px]"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Publish to Cozy Hub
          </button>
        </form>
      </div>

      {/* Community Gallery Feed */}
      <div className="space-y-2 flex-1">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-amber-100 p-0.5">
          Shared Mood Feeds
        </label>

        <div className="space-y-3">
          {setupsList.map((setup) => (
            <div
              key={setup.id}
              className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col gap-2.5"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg bg-black/5 dark:bg-white/10 p-1 rounded-full">{setup.avatar}</span>
                  <div>
                    <h4 className="font-extrabold text-xs leading-none tracking-tight">
                      {setup.name}
                    </h4>
                    <span className="text-[9px] text-slate-900 dark:text-amber-200 font-extrabold leading-none">
                      by @{setup.author} • {setup.createdAt}
                    </span>
                  </div>
                </div>

                {/* Like Counter */}
                <button
                  onClick={() => handleLikeSetup(setup.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all text-[10px] font-bold ${
                    setup.isLikedByUser
                      ? "bg-rose-500/10 text-rose-500 border-rose-300 dark:bg-rose-950/40 dark:border-rose-900"
                      : "bg-slate-500/5 hover:bg-slate-500/10 border-slate-200 dark:border-slate-800 text-slate-500"
                  }`}
                >
                  <Heart className={`w-3 h-3 ${setup.isLikedByUser ? "fill-rose-500" : ""}`} />
                  <span>{setup.likes}</span>
                </button>
              </div>

              {/* Wallpaper mini preview if image */}
              {setup.settings.wallpaperType === "image" ? (
                <div className="h-20 rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-700">
                  <img
                    src={setup.settings.wallpaperUrl}
                    alt={setup.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute right-2 top-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-bold text-white uppercase tracking-widest font-mono">
                    {setup.settings.clockStyle} clock
                  </div>
                </div>
              ) : (
                <div className="h-10 rounded-xl bg-gradient-to-r from-teal-500/10 via-pink-400/10 to-indigo-500/10 flex items-center justify-center border border-dashed border-indigo-200 dark:border-slate-700">
                  <span className="text-[9px] font-mono tracking-widest font-bold uppercase text-indigo-500">
                    Live canvas active setup
                  </span>
                </div>
              )}

              {/* Apply / Adopt Layout Config Button */}
              <button
                onClick={() => onApplyPreset(setup.settings, setup.activeWidgets)}
                className="w-full bg-slate-900 dark:bg-slate-700 hover:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold py-1.5 rounded-xl text-[10px] transition-colors leading-none tracking-medium uppercase"
              >
                🔮 Adopt Setup Configuration
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
