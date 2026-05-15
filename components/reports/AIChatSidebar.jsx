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
  ArrowRight
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
    console.log("Form Identity:", formIdentity);
    console.log("Query:", query);

    try {
      const response = await askAiChat(formIdentity, query, axios);
      console.log("--- AI CHAT SUCCESS ---", response);
      setMessages(prev => [...prev, { role: "assistant", content: response.answer }]);
    } catch (error) {
      console.error("--- AI CHAT ERROR ---", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I encountered an error while processing that. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/10 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div className="relative w-full md:max-w-[50%] bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b bg-blue-600 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Tamarind AI Analyst</h3>
              <p className="text-[10px] text-blue-100 uppercase tracking-wider font-medium">Powering: {centerName}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 bg-slate-50/50">
          <div className="p-4 space-y-4">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-blue-100 text-blue-600" : "bg-blue-600 text-white"
                  }`}>
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${
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
                <div className="flex gap-3 max-w-[85%]">
                  <div className="p-2 rounded-full h-8 w-8 bg-blue-600 text-white flex items-center justify-center animate-pulse">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length < 4 && !isLoading && (
          <div className="px-4 py-2 bg-slate-50/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Suggested Questions</p>
            <div className="grid grid-cols-1 gap-2">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q.query)}
                  className="text-left text-xs p-2.5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-between group shadow-sm"
                >
                  <span className="text-slate-700 font-medium group-hover:text-blue-700">{q.label}</span>
                  <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
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
              placeholder="Ask anything about this report..."
              disabled={isLoading}
              className="pr-12 py-6 rounded-2xl border-slate-200 focus-visible:ring-blue-600 shadow-sm"
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white w-9 h-9"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-[9px] text-center text-slate-400 mt-2">
            The AI Analyst uses real guest feedback to provide insights.
          </p>
        </div>
      </div>
    </div>
  );
}
