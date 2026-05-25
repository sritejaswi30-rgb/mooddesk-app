/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { StickyNote as NoteType } from "../types";
import { Plus, Pin, Trash2, Palette, FileText, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NoteWidgetProps {
  notes: NoteType[];
  setNotes: React.Dispatch<React.SetStateAction<NoteType[]>>;
  widgetOpacity: number;
  glassEffect: boolean;
}

const PASTEL_COLORS = [
  "#fef3c7", // Amber (Yellow)
  "#fbcfe8", // Pink
  "#bfdbfe", // Blue
  "#bbf7d0", // Green
  "#e9d5ff", // Purple
  "#ffedd5", // Orange
];

export default function NoteWidget({ notes, setNotes, widgetOpacity, glassEffect }: NoteWidgetProps) {
  const [activeColor, setActiveColor] = useState(PASTEL_COLORS[0]);
  const [inputText, setInputText] = useState("");

  const handleCreateNote = () => {
    if (!inputText.trim()) return;

    const newNote: NoteType = {
      id: "note_" + Date.now().toString(),
      text: inputText.trim(),
      color: activeColor,
      x: 10 + Math.random() * 40,
      y: 10 + Math.random() * 40,
      pinned: false,
      width: 180,
      height: 180,
      updatedAt: new Date().toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setInputText("");
  };

  const handleTextChange = (id: string, text: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text, updatedAt: new Date().toISOString() } : n))
    );
  };

  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleColorChange = (id: string, color: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, color } : n))
    );
  };

  return (
    <div
      id="note-widget-container"
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
          <div className="bg-amber-100 dark:bg-amber-950/40 p-2 rounded-xl">
            <Palette className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-black text-sm leading-tight tracking-tight text-slate-950 dark:text-stone-50">Cozy Sticky Notes</h3>
            <span className="text-xs text-amber-600 dark:text-amber-300 font-black">Jot thoughts & syncs</span>
          </div>
        </div>
      </div>

      {/* Editor Section */}
      <div className="bg-slate-100/60 dark:bg-slate-800/60 p-3 rounded-2xl mb-4 border border-slate-200/50 dark:border-slate-700/50">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type cozy memos or desk lists here..."
          rows={2}
          className="w-full text-xs bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100 placeholder-slate-400"
        />

        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex gap-1.5">
            {PASTEL_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setActiveColor(c)}
                className={`w-4 h-4 rounded-full border transition-all ${
                  activeColor === c ? "scale-125 border-slate-800 dark:border-white" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <button
            onClick={handleCreateNote}
            disabled={!inputText.trim()}
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-semibold text-[11px] py-1 px-3 rounded-xl transition-all shadow-md shadow-amber-500/10"
          >
            <Plus className="w-3.5 h-3.5" /> Post Memo
          </button>
        </div>
      </div>

      {/* Active Sticky Notes Horizontal Scroll/Grid */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar min-h-[160px]">
        <AnimatePresence initial={false}>
          {notes.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500">
              <FileText className="w-8 h-8 mx-auto mb-1 opacity-40 text-slate-500" />
              <p className="text-xs">No active notes. Try blogging your moods!</p>
            </div>
          ) : (
            notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm relative transition-all"
                style={{ backgroundColor: note.color }}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Pin toggle */}
                    <button
                      onClick={() => handleTogglePin(note.id)}
                      className={`p-1 rounded hover:bg-black/5 transition-colors ${
                        note.pinned ? "text-amber-600 dark:text-amber-500 scale-110" : "text-slate-400"
                      }`}
                    >
                      <Pin className={`w-3 h-3 ${note.pinned ? "fill-amber-600 dark:fill-amber-500" : ""}`} />
                    </button>

                    {/* Palette picker */}
                    <div className="relative group/color">
                      <button className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-black/5">
                        <Palette className="w-3 h-3" />
                      </button>
                      <div className="absolute right-0 top-5 hidden group-hover/color:flex gap-1 bg-white p-1 rounded-md shadow-lg border border-slate-200 z-10">
                        {PASTEL_COLORS.map((pc) => (
                          <button
                            key={pc}
                            onClick={() => handleColorChange(note.id, pc)}
                            className="w-3.5 h-3.5 rounded-full border border-black/10 hover:scale-110 transition-all"
                            style={{ backgroundColor: pc }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Delete item */}
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded hover:bg-black/5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={note.text}
                  onChange={(e) => handleTextChange(note.id, e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0 resize-none h-14"
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
