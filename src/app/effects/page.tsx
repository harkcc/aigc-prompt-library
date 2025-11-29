"use client";

import React from 'react';
import { PromptCard } from '@/components/business/PromptCard';
import { Prompt } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';

const EFFECT_PROMPTS: Prompt[] = [
  {
    id: '3',
    title: '德国水彩地图 (特效)',
    content_raw: '生成一张水彩风格的德国地图，上面用圆珠笔标注所有联邦州。',
    main_image_url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',
    category: 'Effect',
    author: 'FLORIAN GALLWITZ',
    created_at: new Date().toISOString(),
  },
];

export default function EffectsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-black border-b-4 border-black inline-block pr-4">特效区</h1>
        <Badge variant="green" className="text-sm px-3 py-1">
          {EFFECT_PROMPTS.length} 个特效
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EFFECT_PROMPTS.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </main>
  );
}
