import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearnTrack",
  description: "A simple learning progress tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
