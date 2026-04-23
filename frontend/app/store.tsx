"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { INITIAL_CUSTOMERS, type Customer } from "./data/customers";

type EditableField = "name" | "company" | "email" | "phone" | "address";

type StoreValue = {
  customers: Customer[];
  editDraft: Customer | null;
  toast: string | null;
  loadDraft: (id: number) => void;
  clearDraft: () => void;
  updateDraftField: (field: EditableField, value: string) => void;
  commitDraft: () => void;
  showToast: (message: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [editDraft, setEditDraft] = useState<Customer | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadDraft = useCallback(
    (id: number) => {
      const target = customers.find((c) => c.id === id);
      if (target) setEditDraft({ ...target });
    },
    [customers],
  );

  const clearDraft = useCallback(() => setEditDraft(null), []);

  const updateDraftField = useCallback(
    (field: EditableField, value: string) => {
      setEditDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
    },
    [],
  );

  const commitDraft = useCallback(() => {
    setEditDraft((draft) => {
      if (!draft) return null;
      setCustomers((list) =>
        list.map((c) => (c.id === draft.id ? { ...draft } : c)),
      );
      return draft;
    });
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      customers,
      editDraft,
      toast,
      loadDraft,
      clearDraft,
      updateDraftField,
      commitDraft,
      showToast,
    }),
    [
      customers,
      editDraft,
      toast,
      loadDraft,
      clearDraft,
      updateDraftField,
      commitDraft,
      showToast,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export type { EditableField };
