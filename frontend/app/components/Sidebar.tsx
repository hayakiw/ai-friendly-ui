"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: { label: string; href: string }[];
};

const SECTION_MAIN: Item[] = [
  {
    label: "顧客管理",
    icon: <UsersIcon />,
    children: [
      { label: "顧客一覧", href: "/" },
      { label: "新規登録", href: "#" },
      { label: "インポート", href: "#" },
    ],
  },
  { label: "案件管理", icon: <BriefcaseIcon />, href: "#" },
  { label: "請求管理", icon: <YenIcon />, href: "#" },
  { label: "活動履歴", icon: <ClockIcon />, href: "#" },
  { label: "タスク", icon: <CheckSquareIcon />, href: "#" },
];

const SECTION_OPS: Item[] = [
  { label: "レポート", icon: <ChartIcon />, href: "#" },
  { label: "通知管理", icon: <BellIcon />, href: "#" },
  { label: "ユーザー管理", icon: <UserCogIcon />, href: "#" },
  { label: "権限設定", icon: <ShieldIcon />, href: "#" },
  { label: "ログ", icon: <FileIcon />, href: "#" },
  { label: "設定", icon: <GearIcon />, href: "#" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isCustomers =
    pathname === "/" || pathname.startsWith("/customers");

  return (
    <aside className="flex h-screen w-60 flex-col bg-gradient-to-b from-[#1e4976] to-[#0c2340] text-white/90">
      <div className="flex h-14 items-center gap-2 border-b border-white/10 bg-gradient-to-r from-[#0b7fa0] to-[#0a5d8a] px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-white/90 text-[#0b7fa0]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="4 4 20 4 12 20" />
          </svg>
        </div>
        <span className="text-[13px] font-semibold tracking-wide text-white">
          Customer System
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <MenuGroup items={SECTION_MAIN} activeTop={isCustomers ? "顧客管理" : null} />
        <div className="my-2 border-t border-white/10" />
        <MenuGroup items={SECTION_OPS} activeTop={null} />
      </nav>

      <div className="border-t border-white/10 px-3 py-2">
        <button className="flex w-full items-center gap-2 rounded px-3 py-2 text-[12px] text-white/80 transition hover:bg-white/5">
          <LogoutIcon />
          <span>ログアウト</span>
        </button>
      </div>
    </aside>
  );
}

function MenuGroup({
  items,
  activeTop,
}: {
  items: Item[];
  activeTop: string | null;
}) {
  const pathname = usePathname();
  return (
    <ul className="space-y-0.5 px-2">
      {items.map((item) => {
        const expanded = activeTop === item.label;
        return (
          <li key={item.label}>
            <div
              className={`flex items-center gap-2 rounded px-3 py-2 text-[12px] transition ${
                expanded
                  ? "bg-[#0a1f38]"
                  : "cursor-pointer hover:bg-white/5"
              }`}
            >
              <span className="text-white/80">{item.icon}</span>
              <span className="flex-1 text-white/90">{item.label}</span>
              {item.children && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`text-white/50 transition ${expanded ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
            </div>
            {item.children && expanded && (
              <ul className="mb-1 mt-0.5 space-y-0.5 pl-3">
                {item.children.map((c) => {
                  const active =
                    (c.href === "/" && pathname === "/") ||
                    (c.href !== "/" && pathname.startsWith(c.href) && c.href !== "#");
                  return (
                    <li key={c.label}>
                      <Link
                        href={c.href}
                        className={`flex items-center gap-2 rounded px-3 py-1.5 pl-8 text-[12px] transition ${
                          active
                            ? "bg-[#2979ff] text-white shadow-[inset_3px_0_0_#82b1ff]"
                            : "text-white/75 hover:bg-white/5"
                        }`}
                      >
                        {c.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function UsersIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function YenIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4l6 8 6-8" />
      <path d="M4 12h16" />
      <path d="M4 16h16" />
      <path d="M12 12v8" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function CheckSquareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function UserCogIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21v-2a4 4 0 0 1 4-4h6" />
      <circle cx="18" cy="15" r="3" />
      <path d="M18 12v1M18 17v1M21 15h-1M15 15h-1" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01A1.65 1.65 0 0 0 10 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
