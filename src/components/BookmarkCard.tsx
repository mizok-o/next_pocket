import { ExternalLinkIcon, ImagePlaceholderIcon, MenuIcon, StarIcon } from "@/components/icons";
import type { Url } from "@/types";
import Image from "next/image";
import { useState } from "react";

interface BookmarkCardProps {
  url: Url;
  onDelete: (id: number, e: React.MouseEvent) => void;
  onToggleFavorite: (id: number, isFavorite: boolean, e: React.MouseEvent) => void;
  openMenuId: number | null;
  onMenuClick: (id: number, e: React.MouseEvent) => void;
}

export const BookmarkCard = ({
  url,
  onDelete,
  onToggleFavorite,
  openMenuId,
  onMenuClick,
}: BookmarkCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleNewTabClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url.url, "_blank");
  };

  return (
    <button
      type="button"
      onClick={() => window.open(url.url, "_blank")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.open(url.url, "_blank");
        }
      }}
      className="group bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl hover:border-blue-300/60 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden relative text-left w-full hover:-translate-y-1 cursor-pointer"
    >
      <button
        type="button"
        onClick={(e) => onToggleFavorite(url.id, url.is_favorite, e)}
        className="absolute top-4 left-4 z-10 p-2 bg-white/90 hover:bg-white border border-slate-200/60 rounded-xl shadow-lg shadow-slate-500/10 hover:shadow-slate-500/20 transition-all duration-200 backdrop-blur-sm cursor-pointer"
        title={url.is_favorite ? "お気に入りから削除" : "お気に入りに追加"}
        aria-label={url.is_favorite ? "お気に入りから削除" : "お気に入りに追加"}
      >
        <StarIcon
          className={`w-4 h-4 transition-colors duration-200 ${
            url.is_favorite
              ? "text-yellow-500 fill-yellow-500"
              : "text-slate-400 hover:text-yellow-500"
          }`}
          filled={url.is_favorite}
        />
      </button>

      <figure className="relative h-36 bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center border-b border-slate-100/80 overflow-hidden">
        {url.image_url && !imageError ? (
          <Image
            src={url.image_url}
            alt={url.title ? `${url.title}のOGP画像` : "ブックマークサムネイル"}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 rounded-lg" />
            <ImagePlaceholderIcon className="relative h-10 w-10 text-slate-400" />
          </div>
        )}
      </figure>

      <article className="p-6">
        <h3 className="mb-2">
          <span className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors text-lg leading-tight block">
            {url.title || url.url}
          </span>
        </h3>
        {url.description && (
          <p className="text-slate-600 text-sm mt-2 line-clamp-2 leading-relaxed">
            {url.description}
          </p>
        )}
        <footer className="mt-4 flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-slate-100/80 to-blue-100/50 rounded-lg text-xs text-slate-600 font-medium">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
            {new URL(url.url).hostname}
          </span>
        </footer>
      </article>

      <nav className="absolute top-4 right-4 menu-container transition-all duration-200">
        <button
          type="button"
          onClick={(e) => onMenuClick(url.id, e)}
          className="p-2.5 bg-white/90 hover:bg-white border border-slate-200/60 rounded-xl shadow-lg shadow-slate-500/10 hover:shadow-slate-500/20 transition-all duration-200 backdrop-blur-sm cursor-pointer"
          title="メニュー"
        >
          <MenuIcon className="w-4 h-4 text-slate-600" />
        </button>

        {openMenuId === url.id && (
          <menu className="absolute right-0 mt-2 bg-white/95 border border-slate-200/60 rounded-xl shadow-lg backdrop-blur-sm z-10 min-w-[120px] overflow-hidden">
            <li>
              <button
                type="button"
                onClick={(e) => onDelete(url.id, e)}
                className="block w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50/80 transition-colors font-medium cursor-pointer"
              >
                削除
              </button>
            </li>
          </menu>
        )}
      </nav>

      <button
        type="button"
        onClick={handleNewTabClick}
        className="absolute bottom-0 right-0 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border-t border-l border-blue-200/50 rounded-tl-xl transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm cursor-pointer"
        title="新しいタブで開く"
      >
        <ExternalLinkIcon className="w-3.5 h-3.5 text-blue-600" />
      </button>
    </button>
  );
};
