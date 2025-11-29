"use client";

import React from 'react';
import { PromptCard } from '@/components/business/PromptCard';
import { Prompt } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';

const SHOWCASE_PROMPTS: Prompt[] = [
  {
    id: '4',
    title: '御宅族镜子自拍角人物特写',
    content_raw: '### **场景**\n镜子自拍，御宅族电脑角落，蓝色调',
    main_image_url: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=800&q=80',
    category: 'Showcase',
    author: '宝玉',
    created_at: new Date().toISOString(),
  },
];

export default function ShowcasePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-black border-b-4 border-black inline-block pr-4">综合案例</h1>
        <Badge variant="yellow" className="text-sm px-3 py-1">
          {SHOWCASE_PROMPTS.length} 个精选案例
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SHOWCASE_PROMPTS.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </main>
  );
}
