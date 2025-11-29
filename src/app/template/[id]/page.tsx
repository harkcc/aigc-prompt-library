"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { PromptCard } from '@/components/business/PromptCard';
import { Prompt } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock Data Fetching (In a real app, this would be a Server Component fetching from DB)
const getPrompt = (id: string): Prompt => {
  return {
    id,
    title: '设备的爆炸图 (Demo Detail)',
    content_raw: '创建一个 [1080x1080] 尺寸的 [SUBJECT] 技术爆炸图。该设备应被拆解，显示所有单独的组件漂浮在空中，彼此分离以展示内部零件。每个主要组件都已标注。',
    main_image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
    category: 'Template',
    author: 'TECHIESA',
    created_at: new Date().toISOString(),
  };
};

export default function TemplateDetail({ params }: { params: { id: string } }) {
  const prompt = getPrompt(params.id);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" passHref>
          <Button variant="ghost" className="gap-2">
            <ArrowLeft size={16} /> 返回列表
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Visual */}
        <div className="space-y-4">
          <div className="border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <img 
              src={prompt.main_image_url} 
              alt={prompt.title} 
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right: Prompt & Controls */}
        <div className="space-y-6">
           <div>
             <h1 className="text-4xl font-black mb-2">{prompt.title}</h1>
             <p className="text-gray-600">by @{prompt.author}</p>
           </div>

           {/* We reuse the PromptCard logic or a more expanded Editor component here */}
           {/* For now, using PromptCard as a placeholder for the "Output" view */}
           <div className="border-2 border-black p-6 bg-white relative">
              <div className="absolute -top-3 left-4 bg-black text-white px-2 font-bold text-sm">
                提示词编辑器
              </div>
              
              <p className="mb-4 text-sm text-gray-500">
                点击下方的蓝色标签可修改变量内容。
              </p>
              
              {/* Re-using the logic via PromptCard for consistency, 
                  but ideally this would be a dedicated Editor component */}
              <PromptCard prompt={prompt} className="shadow-none hover:translate-y-0 hover:shadow-none border-0" />
           </div>

           <div className="flex gap-4">
             <Button size="lg" className="flex-1">
               复制提示词
             </Button>
             <Button size="lg" variant="secondary" className="flex-1">
               在 Midjourney 中打开
             </Button>
           </div>
        </div>
      </div>
    </main>
  );
}
