"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PromptParser } from './PromptParser';
import { Badge } from '@/components/ui/Badge';
import { ExternalLink, Copy, Trash2, Edit } from 'lucide-react';
import { Prompt } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface PromptCardProps {
  prompt: Prompt;
  className?: string;
  onDelete?: () => void; // Callback when deleted
}

export function PromptCard({ prompt, className, onDelete }: PromptCardProps) {
  const [copied, setCopied] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content_raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除这个提示词吗？此操作不可恢复。')) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('prompts').delete().eq('id', prompt.id);
      if (error) throw error;
      // Notify parent to refresh list
      onDelete?.();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('删除失败，请重试');
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/submit?id=${prompt.id}`);
  };

  if (isDeleting) return null; // Optimistic hide

  return (
    <Card className={className} noPadding>
      {/* Header / Meta */}
      <div className="flex items-center justify-between p-3 border-b-2 border-black bg-white">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-sm">Prompt</span>
          <Button variant="outline" size="sm" className="h-6 text-xs px-2" onClick={handleEdit}>
             <Edit size={12} className="mr-1" /> 编辑
          </Button>
        </div>
        <div className="flex gap-2">
           {prompt.category === 'Showcase' && <Badge variant="yellow">精选</Badge>}
           <button 
             onClick={handleDelete}
             className="text-gray-400 hover:text-red-500 transition-colors"
             title="删除"
           >
             <Trash2 size={16} />
           </button>
        </div>
      </div>

      {/* Author Info */}
      <div className="flex items-center justify-between px-4 py-3 bg-white">
        <div className="flex items-center space-x-1 text-sm font-bold">
          <span>作者</span>
          <span className="underline decoration-2 underline-offset-2">@{prompt.author}</span>
        </div>
        <span className="text-xs text-gray-500 font-mono">{new Date(prompt.created_at).toLocaleDateString()}</span>
      </div>

      {/* Title */}
      <div className="px-4 pb-2">
        <h3 className="text-xl font-extrabold leading-tight">{prompt.title}</h3>
      </div>

      {/* Image Area */}
      <div className="w-full aspect-square border-y-2 border-black relative overflow-hidden group bg-gray-100">
        <img 
          src={prompt.main_image_url} 
          alt={prompt.title} 
          className="w-full h-full object-cover"
        />
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <Button variant="secondary" className="gap-2">
             <ExternalLink size={16} /> 预览
           </Button>
        </div>
      </div>

      {/* Description / Content */}
      <div className="p-4 bg-white">
        <div className="mb-4 text-sm text-gray-600">
          一个可复用的提示模板...
        </div>
        
        {/* Prompt Box */}
        <div className="border-2 border-black p-3 bg-white relative">
          <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold px-2 py-1 transform translate-x-[2px] -translate-y-[2px]">
            提示词
          </div>
          <div className="mt-4">
             <PromptParser content={prompt.content_raw} />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 pt-0 flex gap-2">
        <Button className="flex-1 gap-2" onClick={handleCopy}>
           {copied ? <span className="text-green-400">✓ 已复制</span> : <><Copy size={16} /> 复制提示词</>}
        </Button>
        <Button variant="outline" size="icon">
          <ExternalLink size={18} />
        </Button>
      </div>
    </Card>
  );
}
