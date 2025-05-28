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

export default function Home() {
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
      <h1 className="text-2xl font-bold mb-6">URL一覧</h1>
      <ul className="space-y-4">
        {urls.map((url) => (
          <li key={url.id} className="border rounded p-4">
            <a href={url.url} className="text-blue-600 underline break-all" target="_blank" rel="noopener noreferrer">{url.title || url.url}</a>
            {url.description && <p className="mt-2 text-gray-700">{url.description}</p>}
            {url.image_url && (
              <div className="mt-2 max-h-32 relative w-full h-32">
                <Image src={url.image_url} alt="thumbnail" fill style={{objectFit:'contain'}} />
              </div>
            )}
            <div className="text-xs text-gray-400 mt-2">{url.created_at}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
