"use client";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
};

export default function Button({ children, variant = "primary", className = "", onClick }: ButtonProps) {
  const base = "inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold tracking-wider rounded-full transition transform duration-300";
  const style = variant === "primary"
    ? "bg-gradient-to-r from-purple-500 to-orange-400 text-white shadow-glow hover:scale-105 hover:shadow-lg"
    : "border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15 hover:scale-[1.03]";
  return (
    <button className={`${base} ${style} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}