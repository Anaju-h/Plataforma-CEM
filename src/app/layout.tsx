import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lab Platform",
  description:
    "Plataforma digital para apresentação de serviços e solicitação de orçamentos do laboratório.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}