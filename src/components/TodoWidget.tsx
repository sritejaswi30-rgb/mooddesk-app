/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Check, ClipboardList, Plus, Trash2, Award, Flame, AlertCircle } from "lucide-react";
import { TodoItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface TodoWidgetProps {
  todoItems: TodoItem[];
  setTodoItems: React.Dispatch<React.SetStateAction<TodoItem[]>>;
  widgetOpacity: number;
  glassEffect: boolean;
}

export default function TodoWidget({ todoItems, setTodoItems, widgetOpacity, glassEffect }: TodoWidgetProps) {
  const [inputText, setInputText] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dailyGoal, setDailyGoal] = useState<number>(5);
  const [streak, setStreak] = useState<number>(() => {
    return parseInt(localStorage.getItem("todo_streak") || "3", 10);
  });
  const [celebrate, setCelebrate] = useState(false);

  // Auto increment/decrement streak if goal is met
  const totalCompleted = todoItems.filter((t) => t.completed).length;
  const isGoalMet = totalCompleted >= dailyGoal;

  useEffect(() => {
    localStorage.setItem("todo_streak", streak.toString());
  }, [streak]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newItem: TodoItem = {
      id: "todo_" + Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    };

    setTodoItems((prev) => [newItem, ...prev]);
    setInputText("");
    
    // Auto-advance streak slightly on action
    if (todoItems.length === 0) {
      setStreak((s) => s + 1);
    }
  };

  const handleToggleComplete = (id: string, currentlyCompleted: boolean) => {
    setTodoItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // If completion is transition to TRUE, let's trigger a celebrate visual
          if (!currentlyCompleted) {
            setCelebrate(true);
            setTimeout(() => setCelebrate(false), 800);
          }
          return { ...item, completed: !item.completed };
        }
        return item;
      })
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodoItems((prev) => prev.filter((item) => item.id !== id));
  };

  const priorityColor = (p: string) => {
    switch (p) {
      case "high":
        return "bg-rose-100 hover:bg-rose-200 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900";
      case "medium":
        return "bg-amber-100 hover:bg-amber-200 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900";
      case "low":
      default:
        return "bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900";
    }
  };

  const completedCount = todoItems.filter((item) => item.completed).length;
  const progressPercent = todoItems.length > 0 ? Math.round((completedCount / todoItems.length) * 100) : 0;

  return (
    <div
      id="todo-widget-container"
      className={`${
        glassEffect
          ? "glass-frosted"
          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl"
      } p-5 shadow-xl shadow-black/5 text-slate-800 dark:text-white transition-all duration-300 flex flex-col h-full overflow-hidden`}
      style={{ opacity: widgetOpacity / 100 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-rose-100 dark:bg-rose-950/40 p-2 rounded-xl">
            <ClipboardList className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-black text-sm leading-tight tracking-tight text-slate-950 dark:text-stone-50">Daily Goals</h3>
            <span className="text-xs text-indigo-600 dark:text-amber-300 font-black">Stay consistent!</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
          <span className="text-xs font-black text-amber-700 dark:text-amber-300 font-mono">
            {streak} DAY STREAK
          </span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4 bg-slate-500/5 dark:bg-white/5 rounded-2xl p-3 border border-slate-500/10 dark:border-white/5">
        <div className="flex justify-between items-center text-xs mb-1.5 font-bold text-slate-950 dark:text-stone-50">
          <span>Total Completion</span>
          <span className="text-rose-600 dark:text-rose-400 font-black font-mono text-[11px]">
            {completedCount}/{todoItems.length} Tasks ({progressPercent}%)
          </span>
        </div>
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-400 to-amber-400"
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          />
        </div>

        <div className="flex justify-between items-center mt-3 text-[11px] leading-tight font-black">
          <span className="text-slate-900 dark:text-amber-250">Target Goal: {dailyGoal}</span>
          {isGoalMet ? (
            <span className="flex items-center gap-1 font-black text-emerald-600 dark:text-emerald-400 animate-pulse">
              <Award className="w-3.5 h-3.5" /> Goal Achieved!
            </span>
          ) : (
            <span className="text-slate-800 dark:text-stone-100">
              {dailyGoal - completedCount} more to hit daily goal
            </span>
          )}
        </div>
      </div>

      {/* Inputs */}
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Add dynamic goal..."
            className="w-full text-xs bg-slate-500/5 dark:bg-white/5 border border-slate-500/10 dark:border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:border-rose-400 dark:focus:border-rose-400 text-slate-800 dark:text-white"
          />
        </div>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 focus:outline-none text-slate-800 dark:text-white"
        >
          <option value="low" className="text-slate-800 bg-white dark:bg-slate-900 dark:text-white">Low</option>
          <option value="medium" className="text-slate-800 bg-white dark:bg-slate-900 dark:text-white">Med</option>
          <option value="high" className="text-slate-800 bg-white dark:bg-slate-900 dark:text-white">High</option>
        </select>

        <button
          type="submit"
          className="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white p-2 rounded-xl shadow-lg shadow-rose-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Todo List Scroll */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-[140px]">
        {celebrate && (
          <div className="absolute inset-x-0 top-1/2 flex justify-center pointer-events-none z-25">
            <span className="text-3xl bg-pink-500 text-white font-bold p-2 rounded-full shadow-xl animate-bounce">
              🌸 🎉 COMPLETED! YAY!
            </span>
          </div>
        )}

        <AnimatePresence initial={false}>
          {todoItems.length === 0 ? (
            <div className="text-center py-6 text-slate-400 dark:text-slate-500">
              <ClipboardList className="w-8 h-8 mx-auto mb-1 opacity-40 text-slate-500" />
              <p className="text-xs">No active tasks. Add one to warm up!</p>
            </div>
          ) : (
            todoItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 items-center justify-between p-2.5 rounded-xl border ${
                  item.completed
                    ? "bg-slate-50/50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-900"
                    : "bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/80"
                } shadow-sm`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleComplete(item.id, item.completed)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      item.completed
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-300 dark:border-slate-600 hover:border-rose-400 dark:hover:border-rose-500"
                    }`}
                  >
                    {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-bold truncate ${
                        item.completed
                          ? "line-through text-slate-400 dark:text-slate-500"
                          : "text-slate-950 dark:text-white"
                      }`}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    className={`text-[9px] font-bold py-0.5 px-1.5 rounded-full border ${priorityColor(
                      item.priority
                    )}`}
                  >
                    {item.priority}
                  </span>

                  <button
                    onClick={() => handleDeleteTodo(item.id)}
                    className="text-slate-400 hover:text-rose-500 dark:text-slate-600 dark:hover:text-rose-400 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
