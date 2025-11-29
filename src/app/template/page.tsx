"use client";

import React from 'react';
import { PromptCard } from '@/components/business/PromptCard';
import { Prompt } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';

// Placeholder data - in real app, fetch filtered by category='Template'
const TEMPLATE_PROMPTS: Prompt[] = [
  {
    id: '1',
    title: '设备的爆炸图',
    content_raw: '创建一个 [1080x1080] 尺寸的 [SUBJECT] 技术爆炸图。该设备应被拆解，显示所有单独的组件漂浮在空中，彼此分离以展示内部零件。每个主要组件都已标注。',
    main_image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
    category: 'Template',
    author: 'TECHIESA',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: '带肖像和中英文定制的宽引言卡',
    content_raw: '一张宽幅的名人金句卡，棕色背景，衬线体浅金色“[保持饥饿，保持愚蠢]”，小字“——[Steve Jobs]”，文字前面带一个大的淡淡的引号。人物头像在左边，文字在右边，文字占画面比例 2/3，人物占 1/3。',
    main_image_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80',
    category: 'Template',
    author: 'NICOLECHAN',
    created_at: new Date().toISOString(),
  },
];

export default function TemplatePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-black border-b-4 border-black inline-block pr-4">模版区</h1>
        <Badge variant="blue" className="text-sm px-3 py-1">
          {TEMPLATE_PROMPTS.length} 个模版
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATE_PROMPTS.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </main>
  );
}
