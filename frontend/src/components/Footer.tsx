"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on full-screen monitor page
  if (pathname === "/monitor") {
    return null;
  }

  return (
    <footer className="border-t border-surface-2 bg-primary py-8 shrink-0 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="font-heading text-lg font-bold text-text-primary">
            Blink<span className="text-accent">Safe</span>
          </Link>
          <p className="text-sm text-text-muted mt-1">
            Stay Awake. Stay Alive. Built for safety.
          </p>
        </div>
        <div className="flex gap-4 text-sm text-text-muted font-medium">
          <Link href="/dashboard" className="hover:text-text-primary transition-colors">Dashboard</Link>
          <Link href="/settings" className="hover:text-text-primary transition-colors">Settings</Link>
        </div>
      </div>
    </footer>
  );
}
