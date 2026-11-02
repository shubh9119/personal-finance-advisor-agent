import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexusBank AI | Retail Banking Personal Finance Advisor",
  description: "Agentic AI Multi-Agent Personal Finance Advisor for Retail Banking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#fbfbfd] text-slate-900 selection:bg-purple-100 selection:text-purple-900">
        {children}
      </body>
    </html>
  );
}
