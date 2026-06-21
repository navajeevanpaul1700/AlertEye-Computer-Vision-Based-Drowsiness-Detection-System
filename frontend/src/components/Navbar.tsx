"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Hide Navbar completely on the full-screen monitor page and handle settings/dashboard properly
  if (pathname === "/monitor") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-2 bg-primary/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold tracking-tight text-text-primary">
            Blink<span className="text-accent">Safe</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-6 items-center">
          {pathname === "/" ? (
            <>
              <a href="#features" className="text-text-muted hover:text-text-primary transition-colors text-sm font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-text-muted hover:text-text-primary transition-colors text-sm font-medium">
                How It Works
              </a>
            </>
          ) : null}
          <Link 
            href="/dashboard" 
            className={`transition-colors text-sm font-medium ${pathname === '/dashboard' ? 'text-accent' : 'text-text-muted hover:text-text-primary'}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/settings" 
            className={`transition-colors text-sm font-medium ${pathname === '/settings' ? 'text-accent' : 'text-text-muted hover:text-text-primary'}`}
          >
            Settings
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/monitor"
            className="flex h-9 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-primary shadow transition-all hover:bg-accent/90 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]"
          >
            Start Monitoring
          </Link>
        </div>
      </div>
    </header>
  );
}
