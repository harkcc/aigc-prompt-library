"use client";

import React from 'react';
import { parsePrompt } from '@/lib/parser-utils';
import { VariableTag } from './VariableTag';
import { cn } from '@/lib/utils';

interface PromptParserProps {
  content: string;
  className?: string;
  onVariableClick?: (variableName: string) => void;
}

export function PromptParser({ content, className, onVariableClick }: PromptParserProps) {
  const segments = parsePrompt(content);

  return (
    <div className={cn("font-mono text-base leading-relaxed whitespace-pre-wrap break-words", className)}>
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return <span key={index}>{segment.content}</span>;
        } else {
          return (
            <VariableTag
              key={index}
              name={segment.content}
              onClick={() => onVariableClick?.(segment.content)}
            />
          );
        }
      })}
    </div>
  );
}
