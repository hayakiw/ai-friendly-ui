"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "./store";

const TABS = [
  { key: "all", label: "全顧客", count: 10 },
  { key: "active", label: "アクティブ", count: 8 },
  { key: "dormant", label: "休眠", count: 2 },
  { key: "follow", label: "要フォロー", count: 1 },
];

export default function CustomerListPage() {
  const { customers } = useStore();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [tab, setTab] = useState("all");

  const toggle = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allChecked =
    customers.length > 0 && customers.every((c) => selected.has(c.id));
  const toggleAll = () => {
    setSelected(allChecked ? new Set() : new Set(customers.map((c) => c.id)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-md border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center gap-0.5 border-b border-slate-200 bg-slate-50/70 px-3 pt-2">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-1.5 rounded-t-md border border-b-0 px-4 py-2 text-[12px] transition ${
                active
                  ? "border-slate-200 bg-white text-slate-900"
                  : "border-transparent bg-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <span className={active ? "font-medium" : ""}>{t.label}</span>
              <span
                className={`rounded px-1.5 text-[10px] ${
                  active
                    ? "bg-[#2979ff] text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2">
        <ActionButton>新規登録</ActionButton>
        <ActionButton disabled={selected.size === 0}>編集</ActionButton>
        <ActionButton disabled={selected.size === 0}>削除</ActionButton>
        <div className="mx-1 h-5 w-px bg-slate-200" />
        <ActionButton>エクスポート</ActionButton>
        <ActionButton>印刷</ActionButton>
        <div className="ml-auto flex items-center gap-2 text-[11px] text-slate-500">
          {selected.size > 0 && <span>{selected.size}件選択中</span>}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-slate-200 bg-[#f4f7fb] text-slate-600">
              <th className="w-10 px-2 py-2">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="h-3.5 w-3.5 accent-[#2979ff]"
                />
              </th>
              <th className="w-14 px-2 py-2 text-left font-medium">ID</th>
              <th className="px-2 py-2 text-left font-medium">ステータス</th>
              <th className="px-2 py-2 text-left font-medium">氏名</th>
              <th className="px-2 py-2 text-left font-medium">フリガナ</th>
              <th className="px-2 py-2 text-left font-medium">会社名</th>
              <th className="px-2 py-2 text-left font-medium">メール</th>
              <th className="px-2 py-2 text-left font-medium">電話番号</th>
              <th className="w-24 px-2 py-2 text-left font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => {
              const checked = selected.has(c.id);
              return (
                <tr
                  key={c.id}
                  className={`border-b border-slate-100 transition ${
                    checked ? "bg-[#eaf2ff]" : i % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                  } hover:bg-[#f0f6ff]`}
                >
                  <td className="px-2 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(c.id)}
                      className="h-3.5 w-3.5 accent-[#2979ff]"
                    />
                  </td>
                  <td className="px-2 py-2 text-slate-500 tabular-nums">
                    {String(c.id).padStart(6, "0")}
                  </td>
                  <td className="px-2 py-2">
                    <StatusIcons id={c.id} />
                  </td>
                  <td className="px-2 py-2">
                    <Link
                      href={`/customers/${c.id}`}
                      className="font-medium text-[#2979ff] hover:underline"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-2 py-2 text-slate-600">{c.kana}</td>
                  <td className="px-2 py-2 text-slate-700">{c.company}</td>
                  <td className="px-2 py-2 text-slate-600">{c.email}</td>
                  <td className="px-2 py-2 text-slate-600 tabular-nums">
                    {c.phone}
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/customers/${c.id}`}
                        className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600 hover:border-[#2979ff] hover:text-[#2979ff]"
                      >
                        詳細
                      </Link>
                      <Link
                        href={`/customers/${c.id}/edit`}
                        className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600 hover:border-[#2979ff] hover:text-[#2979ff]"
                      >
                        編集
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/60 px-3 py-2 text-[11px] text-slate-500">
        <div>1 - {customers.length} / 全 {customers.length} 件</div>
        <div className="flex items-center gap-0.5">
          <PageBtn>最初</PageBtn>
          <PageBtn>前へ</PageBtn>
          <PageBtn active>1</PageBtn>
          <PageBtn>2</PageBtn>
          <PageBtn>3</PageBtn>
          <PageBtn>次へ</PageBtn>
          <PageBtn>最後</PageBtn>
        </div>
      </div>
    </motion.div>
  );
}

function ActionButton({
  children,
  disabled = false,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className="rounded border border-slate-200 bg-white px-3 py-1.5 text-[12px] text-slate-700 transition hover:border-[#2979ff] hover:text-[#2979ff] disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400"
    >
      {children}
    </button>
  );
}

function PageBtn({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={`min-w-7 rounded px-2 py-1 transition ${
        active
          ? "bg-[#2979ff] text-white"
          : "text-slate-600 hover:bg-white hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

function StatusIcons({ id }: { id: number }) {
  const variants = [
    { check: true, star: true },
    { check: true, lock: true },
    { check: true, mail: true },
    { check: true, star: true, mail: true },
    { check: true, warn: true },
    { check: false, lock: true },
    { check: true },
    { check: true, mail: true },
    { check: true, star: true },
    { check: true, warn: true },
  ];
  const v = variants[(id - 1) % variants.length];
  return (
    <div className="flex items-center gap-1 text-slate-400">
      {v.check && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {v.star && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15 9 22 9.3 17 14 18.5 21 12 17.3 5.5 21 7 14 2 9.3 9 9" />
        </svg>
      )}
      {v.lock && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      )}
      {v.mail && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2979ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <polyline points="22 7 12 13 2 7" />
        </svg>
      )}
      {v.warn && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" stroke="white" />
          <circle cx="12" cy="17" r="0.5" fill="white" stroke="white" />
        </svg>
      )}
    </div>
  );
}
