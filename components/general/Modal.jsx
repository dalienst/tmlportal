"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

function Modal({ isOpen, onClose, title, children, className }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md cursor-pointer" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={cn(
        "relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300",
        className
      )}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-900 leading-none">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/50 text-slate-500 hover:text-slate-900 transition-all hover:rotate-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[85vh]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
