"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface VariableTagProps {
  name: string;
  value?: string;
  onClick?: () => void;
  className?: string;
}

export function VariableTag({ name, value, onClick, className }: VariableTagProps) {
  const displayContent = value || name;
  
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center mx-1 px-1.5 py-0.5 rounded-sm text-sm font-bold cursor-pointer transition-all select-none",
        // Default style: Light blue background, blue text, thin blue border
        "bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 hover:border-blue-400 active:scale-95",
        className
      )}
      title={`Variable: ${name}`}
    >
      {value ? displayContent : `[${name}]`}
    </span>
  );
}
