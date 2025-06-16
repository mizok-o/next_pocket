'use client'
import { supabase } from "./supabaseClient";
import { useEffect, useState } from "react";
import Image from "next/image";

type Url = {
  id: number
  url: string
  title?: string
  description?: string
  image_url?: string
  created_at: string
}

function formatJSTDate(dateStr: string) {
  const date = new Date(dateStr)
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  const yyyy = jst.getFullYear()
  const mm = String(jst.getMonth() + 1).padStart(2, '0')
  const dd = String(jst.getDate()).padStart(2, '0')
  const hh = String(jst.getHours()).padStart(2, '0')
  const min = String(jst.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`
}

export default function Home() {
  const [urls, setUrls] = useState<Url[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    const fetchUrls = async () => {
      const { data } = await supabase.from("urls").select("*").order("created_at", { ascending: false });
      setUrls((data as Url[]) || []);
    };
    fetchUrls();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newUrl.trim() }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('URLが正常に保存されました');
        setMessageType('success');
        setNewUrl('');
        
        const { data } = await supabase.from("urls").select("*").order("created_at", { ascending: false });
        setUrls((data as Url[]) || []);
      } else {
        setMessage(result.error || 'URLの保存に失敗しました');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error submitting URL:', error);
      setMessage('サーバーエラーが発生しました');
      setMessageType('error');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-center tracking-tight">My Pocket</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="URLを入力してください (例: https://example.com)"
            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading || !newUrl.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? '保存中...' : '保存'}
          </button>
        </div>
        
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            messageType === 'success' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
          }`}>
            {message}
          </div>
        )}
      </form>
      
      <ul className="space-y-6">
        {urls.map((url) => (
          <li key={url.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col gap-2">
            <a href={url.url} className="text-blue-700 dark:text-blue-400 underline font-semibold text-lg break-all" target="_blank" rel="noopener noreferrer">{url.title || url.url}</a>
            {url.description && <p className="text-gray-700 dark:text-gray-300 text-sm">{url.description}</p>}
            {url.image_url && (
              <div className="mt-2 max-h-32 relative w-full h-32">
                <Image src={url.image_url} alt="thumbnail" fill style={{objectFit:'contain'}} />
              </div>
            )}
            <div className="text-xs text-gray-400 mt-2 self-end">{formatJSTDate(url.created_at)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
