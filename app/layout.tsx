import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kanban ToDo",
  description: "localStorage のみで動くカンバン型 ToDo アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
