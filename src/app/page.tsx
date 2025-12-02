"use client";

import React, { useEffect, useState } from 'react';
import { PromptCard } from '@/components/business/PromptCard';
import { Prompt } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { supabase } from '@/lib/supabase';

// Mock Data (Fallback)
const MOCK_PROMPTS: Prompt[] = [
  {
    id: 'mock-1',
    title: '设备的爆炸图 (示例)',
    content_raw: '创建一个 [1080x1080] 尺寸的 [SUBJECT] 技术爆炸图。该设备应被拆解，显示所有单独的组件漂浮在空中，彼此分离以展示内部零件。每个主要组件都已标注。',
    main_image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
    category: 'Template',
    author: 'TECHIESA',
    created_at: new Date().toISOString(),
  },
];

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrompts = async () => {
    // Don't set loading to true here to avoid flash, or handle it gracefully
    // setLoading(true); 
    try {
      // Fetch data from Supabase
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching prompts:', error);
      }

      if (data && data.length > 0) {
        setPrompts(data as any as Prompt[]);
      } else {
        setPrompts(MOCK_PROMPTS);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setPrompts(MOCK_PROMPTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handlePromptDeleted = (id: string) => {
    // Optimistically remove from state
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    // Optionally refetch to be sure
    // fetchPrompts();
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero / Filter Section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-black border-b-4 border-black inline-block pr-4">最新提示词</h1>
        <Badge variant="yellow" className="text-sm px-3 py-1">
          {loading ? '加载中...' : `总计: ${prompts.length}`}
        </Badge>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center font-mono text-gray-500">
          正在连接数据库获取灵感...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <PromptCard 
              key={prompt.id} 
              prompt={prompt} 
              onDelete={() => handlePromptDeleted(prompt.id)} 
            />
          ))}
        </div>
      )}
    </main>
  );
}
