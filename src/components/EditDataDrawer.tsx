import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, RotateCcw, Upload, Download, FileText, Sparkles, Plus, Trash2 } from "lucide-react";
import { AppContentData } from "../types";
import { defaultContent } from "../data/defaultContent";

interface EditDataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  content: AppContentData;
  onSaveContent: (newContent: AppContentData) => void;
  darkMode?: boolean;
}

export const EditDataDrawer: React.FC<EditDataDrawerProps> = ({
  isOpen,
  onClose,
  content,
  onSaveContent,
  darkMode = false,
}) => {
  const [jsonText, setJsonText] = useState("");
  const [activeTab, setActiveTab] = useState<"quick" | "json">("quick");
  const [localContent, setLocalContent] = useState<AppContentData>(content);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleOpen = () => {
    setLocalContent(content);
    setJsonText(JSON.stringify(content, null, 2));
    setErrorMsg("");
    setSuccessMsg("");
  };

  React.useEffect(() => {
    if (isOpen) {
      handleOpen();
    }
  }, [isOpen]);

  const handleSaveQuick = () => {
    onSaveContent(localContent);
    setSuccessMsg("Content saved successfully!");
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const handleSaveJson = () => {
    try {
      const parsed = JSON.parse(jsonText) as AppContentData;
      onSaveContent(parsed);
      setLocalContent(parsed);
      setSuccessMsg("JSON configuration applied & saved!");
      setErrorMsg("");
      setTimeout(() => setSuccessMsg(""), 2500);
    } catch (e: unknown) {
      setErrorMsg("Invalid JSON format. Please check syntax.");
    }
  };

  const handleResetDefault = () => {
    if (window.confirm("Reset all content back to defaults?")) {
      onSaveContent(defaultContent);
      setLocalContent(defaultContent);
      setJsonText(JSON.stringify(defaultContent, null, 2));
      setSuccessMsg("Reset to default content.");
      setTimeout(() => setSuccessMsg(""), 2500);
    }
  };

  const handleExportJsonFile = () => {
    const blob = new Blob([JSON.stringify(localContent, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "happy_girlfriend_day_content.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as AppContentData;
        onSaveContent(parsed);
        setLocalContent(parsed);
        setJsonText(JSON.stringify(parsed, null, 2));
        setSuccessMsg("Imported JSON file successfully!");
      } catch (err) {
        setErrorMsg("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`relative z-10 w-full max-w-2xl h-full flex flex-col shadow-2xl border-l ${
              darkMode ? "bg-slate-900 text-slate-100 border-slate-800" : "bg-white text-slate-800 border-slate-200"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-inherit">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-500" />
                <h3 className="text-lg font-semibold tracking-tight">Customize Memories & Text</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-Header Tabs & Actions */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-inherit bg-black/5 dark:bg-white/5">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("quick")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "quick"
                      ? "bg-pink-500 text-white shadow-sm"
                      : "hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  Form Editor
                </button>
                <button
                  onClick={() => {
                    setActiveTab("json");
                    setJsonText(JSON.stringify(localContent, null, 2));
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "json"
                      ? "bg-pink-500 text-white shadow-sm"
                      : "hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  Raw JSON
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-xs font-medium flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" /> Import
                  <input type="file" accept=".json" onChange={handleImportJsonFile} className="hidden" />
                </label>
                <button
                  onClick={handleExportJsonFile}
                  className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-xs font-medium flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
                <button
                  onClick={handleResetDefault}
                  title="Reset Defaults"
                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 text-xs font-medium flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notification messages */}
            {successMsg && (
              <div className="px-5 py-2 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="px-5 py-2 bg-rose-500/15 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {activeTab === "json" ? (
                <div className="h-full flex flex-col">
                  <p className="text-xs text-slate-500 mb-2">
                    Edit raw JSON directly to modify timeline, reasons, photos, or quiz questions:
                  </p>
                  <textarea
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    className={`flex-1 w-full p-4 rounded-xl text-xs font-mono border outline-none resize-none ${
                      darkMode ? "bg-slate-950 border-slate-800 text-emerald-400" : "bg-slate-900 border-slate-800 text-emerald-400"
                    }`}
                  />
                  <button
                    onClick={handleSaveJson}
                    className="mt-4 py-3 px-6 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
                  >
                    <Save className="w-4 h-4" /> Save JSON Changes
                  </button>
                </div>
              ) : (
                /* Form Editor */
                <div className="space-y-8">
                  {/* Letter Text Section */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-pink-500 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Letter Content
                    </h4>
                    <div className="space-y-2 text-xs">
                      <input
                        type="text"
                        value={localContent.letterText.greeting}
                        onChange={(e) =>
                          setLocalContent({
                            ...localContent,
                            letterText: { ...localContent.letterText, greeting: e.target.value },
                          })
                        }
                        placeholder="Greeting"
                        className="w-full p-2.5 rounded-lg border border-inherit bg-transparent"
                      />
                      <textarea
                        value={localContent.letterText.body1}
                        onChange={(e) =>
                          setLocalContent({
                            ...localContent,
                            letterText: { ...localContent.letterText, body1: e.target.value },
                          })
                        }
                        placeholder="Body Paragraph 1"
                        className="w-full p-2.5 rounded-lg border border-inherit bg-transparent h-16"
                      />
                      <textarea
                        value={localContent.letterText.body2}
                        onChange={(e) =>
                          setLocalContent({
                            ...localContent,
                            letterText: { ...localContent.letterText, body2: e.target.value },
                          })
                        }
                        placeholder="Body Paragraph 2"
                        className="w-full p-2.5 rounded-lg border border-inherit bg-transparent h-16"
                      />
                      <textarea
                        value={localContent.letterText.body3}
                        onChange={(e) =>
                          setLocalContent({
                            ...localContent,
                            letterText: { ...localContent.letterText, body3: e.target.value },
                          })
                        }
                        placeholder="Body Paragraph 3"
                        className="w-full p-2.5 rounded-lg border border-inherit bg-transparent h-20"
                      />
                    </div>
                  </div>

                  {/* Timeline Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-pink-500">Timeline Items</h4>
                      <button
                        onClick={() =>
                          setLocalContent({
                            ...localContent,
                            timeline: [
                              ...localContent.timeline,
                              {
                                id: "t_" + Date.now(),
                                title: "New Memory",
                                date: "Special Date",
                                description: "Memory description...",
                              },
                            ],
                          })
                        }
                        className="text-xs font-medium text-pink-500 hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>

                    <div className="space-y-3">
                      {localContent.timeline.map((item, idx) => (
                        <div key={item.id} className="p-3 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const copy = [...localContent.timeline];
                                copy[idx].title = e.target.value;
                                setLocalContent({ ...localContent, timeline: copy });
                              }}
                              className="font-medium text-xs bg-transparent border-b border-inherit w-full outline-none"
                            />
                            <button
                              onClick={() => {
                                const copy = localContent.timeline.filter((_, i) => i !== idx);
                                setLocalContent({ ...localContent, timeline: copy });
                              }}
                              className="text-rose-500 p-1 hover:bg-rose-500/10 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.date}
                            onChange={(e) => {
                              const copy = [...localContent.timeline];
                              copy[idx].date = e.target.value;
                              setLocalContent({ ...localContent, timeline: copy });
                            }}
                            className="text-xs text-pink-500 bg-transparent border-b border-inherit w-full outline-none"
                          />
                          <textarea
                            value={item.description}
                            onChange={(e) => {
                              const copy = [...localContent.timeline];
                              copy[idx].description = e.target.value;
                              setLocalContent({ ...localContent, timeline: copy });
                            }}
                            className="text-xs bg-transparent w-full outline-none border-b border-inherit h-12"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save Quick Button */}
                  <button
                    onClick={handleSaveQuick}
                    className="w-full py-3 px-6 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
                  >
                    <Save className="w-4 h-4" /> Save Form Changes
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
