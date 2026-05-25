/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Activity, Flame, GlassWater, Plus, Minus, Footprints, RotateCcw, Award } from "lucide-react";
import { WellnessData } from "../types";

interface WellnessWidgetProps {
  widgetOpacity: number;
  glassEffect: boolean;
}

export default function WellnessWidget({ widgetOpacity, glassEffect }: WellnessWidgetProps) {
  const [wellness, setWellness] = useState<WellnessData>(() => {
    const saved = localStorage.getItem("wellness_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return {
      steps: 4321,
      goal: 8000,
      caloriesBurned: 180,
      walkStreak: 4,
      waterIntakeMl: 1000,
      waterGoalMl: 2500,
    };
  });

  useEffect(() => {
    localStorage.setItem("wellness_data", JSON.stringify(wellness));
  }, [wellness]);

  const handleSimulateSteps = () => {
    setWellness((prev) => {
      const addedSteps = Math.round(500 + Math.random() * 500);
      const newSteps = prev.steps + addedSteps;
      const addedCal = Math.round(addedSteps * 0.04);
      return {
        ...prev,
        steps: newSteps,
        caloriesBurned: prev.caloriesBurned + addedCal,
      };
    });
  };

  const handleAddWater = () => {
    setWellness((prev) => ({
      ...prev,
      waterIntakeMl: Math.min(5000, prev.waterIntakeMl + 250),
    }));
  };

  const handleRemoveWater = () => {
    setWellness((prev) => ({
      ...prev,
      waterIntakeMl: Math.max(0, prev.waterIntakeMl - 250),
    }));
  };

  const handleIncrementStreak = () => {
    setWellness((prev) => ({
      ...prev,
      walkStreak: prev.walkStreak + 1,
    }));
  };

  const handleDecrementStreak = () => {
    setWellness((prev) => ({
      ...prev,
      walkStreak: Math.max(0, prev.walkStreak - 1),
    }));
  };

  const handleReset = () => {
    setWellness({
      steps: 0,
      goal: 8000,
      caloriesBurned: 0,
      walkStreak: 0,
      waterIntakeMl: 0,
      waterGoalMl: 2500,
    });
  };

  const stepPercent = Math.min(100, Math.round((wellness.steps / wellness.goal) * 100));
  const waterPercent = Math.min(100, Math.round((wellness.waterIntakeMl / wellness.waterGoalMl) * 100));

  const textPrimary = "text-slate-950 dark:text-stone-50 font-black";
  const textSecondary = "text-slate-900 dark:text-amber-200/90 font-black";
  const containerStyle = glassEffect
    ? `glass-frosted ${textPrimary}`
    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-800 dark:text-white";

  return (
    <div
      id="wellness-widget-container"
      className={`${containerStyle} p-5 shadow-xl shadow-black/5 transition-all duration-300 flex flex-col h-full overflow-hidden`}
      style={{ opacity: widgetOpacity / 100 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/10 p-2 rounded-xl">
            <Footprints className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className={`font-bold text-sm leading-tight tracking-tight ${textPrimary}`}>Wellness core</h3>
            <span className={`text-[10px] uppercase font-mono tracking-wider ${textSecondary}`}>Step & Hydration Log</span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-[10px] font-bold py-1 px-2 hover:text-rose-400 hover:border-rose-450 transition-colors rounded-lg border border-slate-500/15 flex items-center gap-1 opacity-70 hover:opacity-100 font-mono"
          title="Reset tracker stats"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Habits Streak Box - Elegant Local Tracker */}
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="absolute -top-1 -right-1 text-[8px] bg-red-500 text-white rounded-full px-1 py-0.2 select-none font-bold animate-bounce">
              streak
            </span>
          </div>
          <div>
            <h4 className={`font-bold text-xs ${textPrimary}`}>Habit streak</h4>
            <p className={`text-[10px] font-mono ${textSecondary}`}>
              {wellness.walkStreak} Days consecutive study!
            </p>
          </div>
        </div>

        {/* Counter controls */}
        <div className="flex items-center gap-1 bg-stone-500/10 p-0.5 rounded-lg border border-stone-500/15">
          <button
            onClick={handleDecrementStreak}
            className={`p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-all ${textPrimary}`}
            title="Minus 1 day"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className={`text-xs font-extrabold font-mono px-1.5 ${textPrimary}`}>
            {wellness.walkStreak}
          </span>
          <button
            onClick={handleIncrementStreak}
            className={`p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-all ${textPrimary}`}
            title="Plus 1 day streak!"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Steps circle/progress and simulator */}
      <div className="bg-emerald-500/5 p-3 rounded-2xl border border-emerald-500/10 mb-3 flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-xs font-bold flex items-center gap-1 ${textPrimary}`}>
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> Walked Today
          </span>
          <span className="text-xs font-extrabold font-mono text-emerald-500 dark:text-emerald-400">
            {wellness.steps.toLocaleString()} / {wellness.goal.toLocaleString()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-750 rounded-full overflow-hidden mb-2 relative">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${stepPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] mb-1.5">
          <span className={`flex items-center gap-0.5 ${textSecondary}`}>
            🔥 {wellness.caloriesBurned} kcal active
          </span>
          <span className={`font-bold ${textSecondary}`}>Goal Done: {stepPercent}%</span>
        </div>

        <button
          onClick={handleSimulateSteps}
          className="w-full text-[10px] font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-1.5 mt-1 shadow-md shadow-emerald-500/10 active:scale-95 transition-all text-center uppercase tracking-wider block font-mono"
        >
          🦶 Tap to Walk +500 steps
        </button>
      </div>

      {/* Water Tracker Sub-Section */}
      <div className="bg-sky-500/5 p-3 rounded-2xl border border-sky-500/10 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <GlassWater className="w-6 h-6 text-sky-450 animate-bounce" style={{ animationDuration: "3s" }} />
          <div>
            <h4 className={`font-bold text-xs ${textPrimary}`}>Hydration Index</h4>
            <p className={`text-[10px] font-mono ${textSecondary}`}>
              {wellness.waterIntakeMl}ml / {wellness.waterGoalMl}ml
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleRemoveWater}
            disabled={wellness.waterIntakeMl === 0}
            className="p-1 px-1.5 bg-black/5 dark:bg-white/5 border border-slate-500/10 text-[9px] font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
            title="Minus 250ml"
          >
            -250
          </button>
          
          <button
            onClick={handleAddWater}
            className="bg-sky-500 text-white rounded-lg p-1.5 shadow hover:bg-sky-600 active:scale-95 transition-all"
            title="Drink glass (+250ml)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
