"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useStore } from "../../store";

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { customers } = useStore();
  const customer = customers.find((c) => c.id === id);
  if (!customer) return notFound();

  return (
    <motion.article
      key={id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-md border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-4 py-2">
        <div className="flex items-center gap-2 text-[12px] text-slate-500">
          <Link href="/" className="hover:text-[#2979ff]">
            顧客一覧
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700">詳細</span>
          <span className="text-slate-400 tabular-nums">
            (ID: {String(customer.id).padStart(6, "0")})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-600 hover:border-[#2979ff] hover:text-[#2979ff]"
          >
            一覧に戻る
          </Link>
          <Link
            href={`/customers/${customer.id}/edit`}
            className="rounded bg-[#2979ff] px-3 py-1 text-[12px] font-medium text-white hover:bg-[#1e6fe6]"
          >
            編集
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2979ff] to-[#1e4976] text-lg font-semibold text-white">
            {customer.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                {customer.name}
              </h2>
              <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                アクティブ
              </span>
            </div>
            <p className="text-[12px] text-slate-500">{customer.kana}</p>
            <p className="mt-1 text-[12px] text-slate-600">{customer.company}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-0 rounded border border-slate-200 md:grid-cols-2">
          <DetailRow label="顧客ID" value={String(customer.id).padStart(6, "0")} />
          <DetailRow label="氏名" value={customer.name} />
          <DetailRow label="フリガナ" value={customer.kana} />
          <DetailRow label="会社名" value={customer.company} />
          <DetailRow label="メール" value={customer.email} />
          <DetailRow label="電話番号" value={customer.phone} />
          <DetailRow label="住所" value={customer.address} full />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-0 rounded border border-slate-200 md:grid-cols-2">
          <DetailRow label="登録日" value="2025-08-01" />
          <DetailRow label="最終更新" value="2026-04-20" />
          <DetailRow label="担当者" value="佐々木 太一" />
          <DetailRow label="ランク" value="ゴールド" />
        </div>
      </div>
    </motion.article>
  );
}

function DetailRow({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div
      className={`flex border-slate-200 ${full ? "md:col-span-2" : ""} border-b last:border-b-0 md:border-b md:[&:nth-last-child(-n+2)]:border-b-0`}
    >
      <div className="w-32 shrink-0 border-r border-slate-200 bg-slate-50/60 px-4 py-2.5 text-[12px] font-medium text-slate-600">
        {label}
      </div>
      <div className="flex-1 px-4 py-2.5 text-[12px] text-slate-800">
        {value}
      </div>
    </div>
  );
}
