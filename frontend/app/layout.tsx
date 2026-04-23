import type { Metadata } from "next";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";
import { StoreProvider } from "./store";
import "./globals.css";

export const metadata: Metadata = {
  title: "Customer System - AIフレンドリーUI",
  description: "プロンプトで操作できる顧客管理デモ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <StoreProvider>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <Header />
              <main className="flex-1 overflow-auto bg-[#eef2f7] p-4">
                <div className="mb-3">
                  <SearchBar />
                </div>
                {children}
              </main>
            </div>
          </div>
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
