"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStore, type EditableField } from "../../../store";

export default function CustomerEditPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const {
    customers,
    editDraft,
    loadDraft,
    clearDraft,
    updateDraftField,
    commitDraft,
    showToast,
  } = useStore();

  const source = customers.find((c) => c.id === id);

  useEffect(() => {
    if (source && editDraft?.id !== id) loadDraft(id);
  }, [id, source, editDraft?.id, loadDraft]);

  useEffect(() => {
    return () => {
      clearDraft();
    };
  }, [clearDraft]);

  if (!source) return notFound();
  if (!editDraft || editDraft.id !== id) return null;

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    commitDraft();
    showToast("保存しました");
    router.push(`/customers/${id}`);
  }

  return (
    <motion.form
      key={id}
      onSubmit={handleSave}
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
          <Link
            href={`/customers/${id}`}
            className="hover:text-[#2979ff]"
          >
            詳細
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700">編集</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/customers/${id}`}
            className="rounded border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-600 hover:border-slate-400"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            className="rounded bg-[#2979ff] px-3 py-1 text-[12px] font-medium text-white hover:bg-[#1e6fe6]"
          >
            保存
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-[14px] font-semibold text-slate-900">基本情報</h2>
          <p className="text-[11px] text-slate-500">
            赤字は必須項目です。AIに「住所を〜に変更して」などと指示することもできます。
          </p>
        </div>

        <div className="overflow-hidden rounded border border-slate-200">
          <Field
            label="氏名"
            required
            field="name"
            value={editDraft.name}
            onChange={updateDraftField}
          />
          <Field
            label="フリガナ"
            field="name"
            value={editDraft.kana}
            onChange={() => {}}
            readOnly
          />
          <Field
            label="会社名"
            field="company"
            value={editDraft.company}
            onChange={updateDraftField}
          />
          <Field
            label="メール"
            required
            field="email"
            value={editDraft.email}
            onChange={updateDraftField}
            type="email"
          />
          <Field
            label="電話番号"
            field="phone"
            value={editDraft.phone}
            onChange={updateDraftField}
          />
          <Field
            label="住所"
            field="address"
            value={editDraft.address}
            onChange={updateDraftField}
            last
          />
        </div>
      </div>
    </motion.form>
  );
}

function Field({
  label,
  field,
  value,
  onChange,
  required = false,
  readOnly = false,
  type = "text",
  last = false,
}: {
  label: string;
  field: EditableField;
  value: string;
  onChange: (field: EditableField, value: string) => void;
  required?: boolean;
  readOnly?: boolean;
  type?: string;
  last?: boolean;
}) {
  return (
    <motion.div
      className={`flex items-stretch ${last ? "" : "border-b border-slate-200"}`}
      animate={{ backgroundColor: ["#eaf2ff", "rgba(255,255,255,0)"] }}
      transition={{ duration: 0.8 }}
      key={value}
    >
      <div className="flex w-32 shrink-0 items-center gap-1 border-r border-slate-200 bg-slate-50/60 px-4 py-2 text-[12px] font-medium text-slate-600">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </div>
      <div className="flex-1 px-3 py-1.5">
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange(field, e.target.value)}
          className={`w-full max-w-xl rounded border border-slate-300 bg-white px-2.5 py-1.5 text-[12px] text-slate-800 outline-none transition focus:border-[#2979ff] focus:shadow-[0_0_0_3px_rgba(41,121,255,0.15)] ${
            readOnly ? "bg-slate-50 text-slate-500" : ""
          }`}
        />
      </div>
    </motion.div>
  );
}
