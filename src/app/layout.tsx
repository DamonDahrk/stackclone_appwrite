import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/app/components/Header";
import AuthProvider from "@/app/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StackFlow - Developer Q&A Community",
  description: "Ask questions, share knowledge, and connect with developers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "dark:bg-black dark:text-white")}>
        <Header />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
