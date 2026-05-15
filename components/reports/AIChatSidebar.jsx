"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  ThumbsDown, 
  ArrowRight,
  Maximize2,
  Minimize2,
  LayoutGrid,
  Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { askAiChat } from "@/services/feedbackforms";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";

const SUGGESTED_QUESTIONS = [
  { label: "Summarize this week's trends", query: "Summarize the key trends and guest sentiment for this week." },
  { label: "What are the common complaints?", query: "Identify any recurring complaints or issues mentioned by guests." },
  { label: "Highlight our top strengths", query: "What are our biggest strengths based on recent feedback?" },
  { label: "Specific staff mentions", query: "Are there any specific staff members mentioned positively?" }
];

export default function AIChatSidebar({ isOpen, onClose, formIdentity, centerName }) {
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: `Hello! I'm your AI Analyst for ${centerName}. How can I help you understand your feedback data today?` 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isCentered, setIsCentered] = useState(false);
  const messagesEndRef = useRef(null);
  const axios = useAxiosAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (query = input) => {
    if (!query.trim() || isLoading) return;

    const userMessage = { role: "user", content: query };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    console.log("--- STARTING AI CHAT CALL ---");
    try {
      const response = await askAiChat(formIdentity, query, axios);
      setMessages(prev => [...prev, { role: "assistant", content: response.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I encountered an error while processing that. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Layout logic
  const getContainerClasses = () => {
    if (isCentered) {
      return "fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10";
    }
    return "fixed inset-0 z-50 flex justify-end items-end p-4 pointer-events-none";
  };

  const getPanelClasses = () => {
    const base = "bg-white shadow-2xl flex flex-col transition-all duration-300 pointer-events-auto rounded-2xl border border-slate-200 overflow-hidden";
    
    if (isCentered) {
      return `${base} w-full max-w-4xl h-[80vh] animate-in zoom-in-95`;
    }
    
    if (isMaximized) {
      return `${base} w-full md:max-w-[40%] h-[90vh] animate-in slide-in-from-right`;
    }
    
    // Default: Half height, compact
    return `${base} w-full md:max-w-[380px] h-[55vh] animate-in slide-in-from-bottom`;
  };

  return (
    <div className={getContainerClasses()}>
      {/* Backdrop (Only when centered or on small screens) */}
      {(isCentered || true) && (
        <div 
          className="absolute inset-0 bg-black/5 transition-opacity" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Panel */}
      <div className={getPanelClasses()}>
        {/* Header */}
        <div className="p-3 border-b bg-blue-600 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xs">Ukwaju AI</h3>
              <p className="text-[9px] text-blue-100 uppercase font-medium truncate max-w-[150px]">Context: {centerName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setIsCentered(!isCentered);
                setIsMaximized(false);
              }}
              className="h-7 w-7 text-white hover:bg-white/10"
              title={isCentered ? "Dock to Side" : "Center View"}
            >
              <Monitor className="w-3.5 h-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setIsMaximized(!isMaximized);
                setIsCentered(false);
              }}
              className="h-7 w-7 text-white hover:bg-white/10"
              title={isMaximized ? "Minimize" : "Expand"}
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 text-white hover:bg-white/10">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 bg-slate-50/50">
          <div className="p-3 space-y-3">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2.5 max-w-[90%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`p-1.5 rounded-full h-7 w-7 flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-blue-100 text-blue-600" : "bg-blue-600 text-white"
                  }`}>
                    {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`p-2.5 rounded-2xl text-[13px] shadow-sm ${
                    msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                  }`}>
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2.5 max-w-[90%]">
                  <div className="p-1.5 rounded-full h-7 w-7 bg-blue-600 text-white flex items-center justify-center animate-pulse">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white p-2.5 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1 items-center">
                    <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {!isLoading && (
          <div className="px-3 py-2 bg-slate-50/50 border-t border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Suggested</p>
            <div className={`grid gap-1.5 ${isCentered || isMaximized ? "grid-cols-2" : "grid-cols-1"}`}>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q.query)}
                  className="text-left text-[11px] p-2 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-between group shadow-xs"
                >
                  <span className="text-slate-700 font-medium group-hover:text-blue-700 truncate">{q.label}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 border-t bg-white">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="pr-10 py-5 rounded-xl border-slate-200 focus-visible:ring-blue-600 shadow-xs text-sm"
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim() || isLoading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white w-7 h-7"
            >
              <Send className="w-3 h-3" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
