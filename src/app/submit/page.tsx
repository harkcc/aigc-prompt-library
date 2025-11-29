"use client";

import React, { useState, Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { PromptCard } from '@/components/business/PromptCard';
import { PromptParser } from '@/components/business/PromptParser';
import { Prompt, PromptCategory } from '@/lib/types';
import { ArrowLeft, Image as ImageIcon, UploadCloud, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

function SubmitForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  
  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('User');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PromptCategory>('Template');
  
  // Image Upload State
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false); // For fetching edit data

  // Fetch data if in edit mode
  React.useEffect(() => {
    if (!editId) return;
    
    const fetchPrompt = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', editId)
        .single();
        
      if (data) {
        setTitle(data.title);
        setAuthor(data.author);
        setContent(data.content_raw);
        setCategory(data.category as PromptCategory);
        setImageUrl(data.main_image_url || '');
      }
      setLoading(false);
    };

    fetchPrompt();
  }, [editId]);

  // Derived state for preview
  const previewPrompt: Prompt = {
    id: 'preview',
    title: title || '未命名标题',
    content_raw: content || '提示词内容为空...',
    main_image_url: imageUrl || 'https://via.placeholder.com/800x800?text=Preview',
    category: category,
    author: author,
    created_at: new Date().toISOString(),
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Create a local preview URL immediately
      const objectUrl = URL.createObjectURL(selectedFile);
      setImageUrl(objectUrl);
    }
  };

  const uploadImage = async (fileToUpload: File): Promise<string | null> => {
    try {
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('prompt-images')
        .upload(filePath, fileToUpload);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('prompt-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('图片上传失败！请检查是否已在 Supabase 创建 "prompt-images" 公开存储桶。');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('请填写完整信息');
      return;
    }
    
    setUploading(true);

    try {
      let finalImageUrl = imageUrl;

      // 1. Upload Image if file selected
      if (file) {
        const uploadedUrl = await uploadImage(file);
        if (!uploadedUrl) {
          setUploading(false);
          return;
        }
        finalImageUrl = uploadedUrl;
      }

      // 2. Insert or Update Data to Supabase
      const promptData = {
        title,
        content_raw: content,
        main_image_url: finalImageUrl,
        category,
        author,
      };

      let error;
      
      if (editId) {
        // Update existing
        const { error: updateError } = await supabase
          .from('prompts')
          .update(promptData)
          .eq('id', editId);
        error = updateError;
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from('prompts')
          .insert([promptData]);
        error = insertError;
      }

      if (error) throw error;

      alert(editId ? '更新成功！' : '发布成功！');
      router.push('/'); // Redirect to home
    } catch (error) {
      console.error('Error submitting prompt:', error);
      alert('发布失败，请查看控制台错误信息。');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Left: Form */}
      <div className="space-y-8">
        <div>
            <h1 className="text-4xl font-black mb-2">{editId ? '编辑提示词' : '新增基础单元'}</h1>
            <p className="text-gray-600">{editId ? '修改您的作品信息。' : '提交您的提示词作品，分享创意。'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          
          {/* Title Input */}
          <div className="space-y-2">
            <label className="font-bold block">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：赛博朋克风格的猫"
              className="w-full h-10 px-3 border-2 border-black focus:outline-none focus:bg-gray-50 transition-colors"
              required
            />
          </div>

          {/* Image Input (File & URL) */}
          <div className="space-y-2">
            <label className="font-bold block flex items-center gap-2">
              <ImageIcon size={16} /> 封面图片
            </label>
            
            {/* Tabs or simple switcher could go here, but for now we stack them */}
            <div className="space-y-3">
              {/* File Upload */}
              <div className="border-2 border-dashed border-black bg-gray-50 p-4 text-center hover:bg-gray-100 transition-colors relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                  <UploadCloud size={24} />
                  <span className="text-sm font-bold text-black">点击上传本地图片</span>
                  <span className="text-xs">支持 JPG, PNG, WebP</span>
                </div>
              </div>

              <div className="text-center text-xs font-bold text-gray-400">- 或者 -</div>

              {/* URL Input */}
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setFile(null); // Clear file if manually typing URL
                }}
                placeholder="粘贴网络图片链接 (URL)..."
                className="w-full h-10 px-3 border-2 border-black focus:outline-none focus:bg-gray-50 transition-colors text-sm"
              />
            </div>
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <label className="font-bold block">分类板块</label>
            <div className="flex gap-4 flex-wrap">
              {(['Template', 'Effect', 'Tool', 'Showcase'] as PromptCategory[]).map((cat) => (
                <label key={cat} className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={category === cat}
                    onChange={(e) => setCategory(e.target.value as PromptCategory)}
                    className="accent-black w-4 h-4"
                  />
                  <span className="text-sm font-bold capitalize">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Content Textarea */}
          <div className="space-y-2">
            <label className="font-bold block">提示词内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="在此输入提示词。支持使用 [变量名] 格式定义可替换变量。"
              className="w-full h-40 p-3 border-2 border-black focus:outline-none focus:bg-gray-50 transition-colors font-mono text-sm resize-y"
              required
            />
            {/* Live Parser Preview specific to the textarea context */}
            <div className="p-3 bg-gray-100 border-2 border-dashed border-gray-300">
              <div className="text-xs font-bold text-gray-500 mb-2 uppercase">变量解析预览</div>
              <PromptParser content={content || '等待输入...'} className="text-sm text-gray-500" />
            </div>
          </div>

          {/* Author Input */}
            <div className="space-y-2">
            <label className="font-bold block">作者署名</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full h-10 px-3 border-2 border-black focus:outline-none focus:bg-gray-50 transition-colors"
            />
          </div>

          <Button type="submit" size="lg" className="w-full gap-2" disabled={uploading || loading}>
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> 正在{editId ? '保存' : '发布'}...
              </>
            ) : (
              editId ? '保存修改' : '提交作品'
            )}
          </Button>
        </form>
      </div>

      {/* Right: Preview */}
      <div className="sticky top-24 space-y-4 hidden lg:block">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-wider">实时预览</h2>
          <span className="text-xs font-mono bg-yellow-300 border border-black px-2 py-1 font-bold">LIVE PREVIEW</span>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 p-4 flex justify-center bg-gray-50">
            {/* We wrap the card to constrain width if needed, though PromptCard is responsive */}
            <div className="w-full max-w-md">
              <PromptCard prompt={previewPrompt} />
            </div>
        </div>
        
        <p className="text-center text-sm text-gray-500">
          这就是您的作品在列表中的样子。
        </p>
      </div>
    </div>
  );
}

export default function SubmitPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/" passHref>
          <Button variant="ghost" className="gap-2">
            <ArrowLeft size={16} /> 返回首页
          </Button>
        </Link>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-black" size={40} />
          <span className="ml-4 font-bold text-lg">正在加载编辑器...</span>
        </div>
      }>
        <SubmitForm />
      </Suspense>
    </main>
  );
}
