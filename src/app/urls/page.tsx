'use client'
import { supabase } from "../supabaseClient"; // パスを修正
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

export default function UrlsPage() { // 関数名を UrlsPage に変更
  const [urls, setUrls] = useState<Url[]>([]);

  useEffect(() => {
    const fetchUrls = async () => {
      const { data } = await supabase.from("urls").select("*").order("created_at", { ascending: false });
      setUrls((data as Url[]) || []);
    };
    fetchUrls();
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-center tracking-tight">My NEXT Pocket</h1>
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