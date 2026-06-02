import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Root layout is just a shell now.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgeSense Initiative | Professional Compassion",
  description: "Bridging the generational gap through professional compassion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface font-sans selection:bg-primary-container selection:text-on-primary-container min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
