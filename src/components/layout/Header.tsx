"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Search, Plus } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b-2 border-black">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-xl">
            A
          </div>
          <span className="text-xl font-extrabold tracking-tight">AIGC PROMPTS</span>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6 font-bold text-sm">
          <Link href="/" className="hover:underline decoration-2 underline-offset-4">首页</Link>
          <Link href="/template" className="hover:underline decoration-2 underline-offset-4">模版区</Link>
          <Link href="/effects" className="hover:underline decoration-2 underline-offset-4">特效区</Link>
          <Link href="/showcase" className="hover:underline decoration-2 underline-offset-4">综合案例</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
           <div className="relative hidden sm:block">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
             <input 
               type="text" 
               placeholder="搜索提示词..." 
               className="pl-9 pr-4 h-10 w-64 border-2 border-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
             />
           </div>
           <Link href="/submit">
             <Button size="sm" className="gap-2">
               <Plus size={16} /> 提交
             </Button>
           </Link>
        </div>
      </div>
    </header>
  );
}
