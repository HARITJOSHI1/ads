import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ModalProvider from "@/provider/modal-provider";
import { TanstackProvider } from "@/provider/query-client-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <TanstackProvider>
          <ModalProvider>
            {children}
            <Toaster />
          </ModalProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
