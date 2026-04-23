"use client";

export default function Header() {
  return (
    <header className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="text-[12px] text-slate-500">
        <span className="text-slate-400">ホーム</span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-slate-700">顧客管理</span>
      </div>
      <div className="flex items-center gap-4 text-[12px] text-slate-600">
        <button className="relative text-slate-500 hover:text-slate-800">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
            3
          </span>
        </button>
        <div className="h-5 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600">
            KH
          </div>
          <span>管理者</span>
        </div>
        <button className="flex items-center gap-1.5 rounded px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>ログアウト</span>
        </button>
      </div>
    </header>
  );
}
