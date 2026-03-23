"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, LogOut, Menu, X, Waves } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar({ 
  brand = "Admin Portal", 
  subtitle = "Management Console", 
  navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutGrid },
  ],
  homeHref = "/admin",
  logoutCallback = "/login"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ callbackUrl: logoutCallback });
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={homeHref} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 ring-4 ring-primary/5">
                <Waves className="text-primary h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-none tracking-tight">{brand}</span>
                {subtitle && <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.1em] mt-1">{subtitle}</span>}
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  pathname === item.href 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-border mx-2" />
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-destructive hover:bg-destructive/10 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-muted-foreground hover:bg-muted transition-all"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-white animate-in slide-in-from-top-2 duration-300">
          <div className="px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-bold transition-all",
                  pathname === item.href 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                {item.label}
              </Link>
            ))}
            
            <div className="border-t my-4 opacity-50" />
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-bold text-destructive hover:bg-destructive/10 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
