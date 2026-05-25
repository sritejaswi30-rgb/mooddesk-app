/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Clock, Calendar, ShieldAlert } from "lucide-react";
import { ClockStyle } from "../types";

interface ClockWidgetProps {
  style: ClockStyle;
  widgetOpacity: number;
  glassEffect: boolean;
}

export default function ClockWidget({ style, widgetOpacity, glassEffect }: ClockWidgetProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatHours = (date: Date) => {
    let hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hoursStr = hours < 10 ? "0" + hours : hours.toString();
    return { hoursStr, ampm };
  };

  const padZero = (num: number) => (num < 10 ? "0" + num : num.toString());

  const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const months = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  const currentDay = days[time.getDay()];
  const currentDateStr = `${months[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`;
  const { hoursStr, ampm } = formatHours(time);
  const minutesStr = padZero(time.getMinutes());
  const secondsStr = padZero(time.getSeconds());

  // Styling presets based on selected option
  const getStyleClasses = () => {
    switch (style) {
      case "neon":
        return {
          container: "bg-black/80 border-2 border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] font-mono rounded-none p-6",
          timeText: "text-5xl font-bold tracking-widest text-[#39ff14] drop-shadow-[0_0_8px_#39ff14]",
          secondaryText: "text-emerald-300 uppercase tracking-widest text-xs font-semibold",
          iconColor: "text-[#39ff14]",
        };
      case "minimal":
        return {
          container: "bg-transparent text-slate-950 dark:text-white font-sans p-4 border border-transparent",
          timeText: "text-6xl font-light tracking-tighter",
          secondaryText: "text-slate-900 dark:text-amber-350 text-sm font-extrabold tracking-normal",
          iconColor: "text-rose-500 dark:text-rose-400",
        };
      case "retro":
        return {
          container: "bg-[#2c203b] border-4 border-[#ffb000] text-[#ffb000] font-mono rounded-none p-5 shadow-[4px_4px_0px_#000]",
          timeText: "text-4xl uppercase tracking-wider font-extrabold",
          secondaryText: "text-[#ffb000] opacity-95 uppercase tracking-wider font-black text-xs",
          iconColor: "text-[#ffb000]",
        };
      case "glass":
      default:
        return {
          container: `${
            glassEffect
              ? "glass-frosted text-slate-950 dark:text-white"
              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-950 dark:text-white"
          } p-6 shadow-xl shadow-black/5`,
          timeText: `text-5xl font-extrabold tracking-tight tabular-nums ${glassEffect ? "text-slate-950 dark:text-white" : ""}`,
          secondaryText: `${glassEffect ? "text-rose-700 dark:text-rose-300" : "text-slate-900 dark:text-amber-300"} font-black text-xs tracking-widest uppercase`,
          iconColor: "text-rose-500 dark:text-rose-400",
        };
    }
  };

  const styleClasses = getStyleClasses();

  return (
    <div
      id="clock-widget-container"
      className={`${styleClasses.container} transition-all duration-300 h-full flex flex-col justify-between`}
      style={{ opacity: widgetOpacity / 100 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${styleClasses.iconColor} animate-pulse`} />
          <span className={styleClasses.secondaryText}>{currentDay}</span>
        </div>
        <div className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-black/10 dark:bg-white/10 font-black text-slate-950 dark:text-white">
          {style.toUpperCase()} CLOCK
        </div>
      </div>

      <div className="my-3 flex items-baseline justify-start gap-1">
        <span className={styleClasses.timeText}>
          {hoursStr}:{minutesStr}
        </span>
        <span className={`text-xl font-bold uppercase ml-1 ${styleClasses.iconColor} drop-shadow-sm`}>
          {ampm}
        </span>
        <span className="text-sm font-mono font-black opacity-100 ml-2 text-slate-950 dark:text-amber-200 drop-shadow-sm">
          :{secondsStr}
        </span>
      </div>

      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-500/10 dark:border-white/10">
        <Calendar className="w-4 h-4 text-rose-500" />
        <span className="text-xs font-black tracking-normal font-mono uppercase opacity-100 text-slate-950 dark:text-stone-100 drop-shadow-sm">
          {currentDateStr}
        </span>
      </div>
    </div>
  );
}
