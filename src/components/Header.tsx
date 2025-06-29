import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image
                src="/app-icon.png"
                alt="Ato（あと）"
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg shadow-sm"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Ato（あと）
              </span>
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-slate-600">{title}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
