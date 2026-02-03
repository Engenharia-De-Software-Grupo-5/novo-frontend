import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestão de Imóveis",
  description: "Administração das unidades",
};

export default function ImoveisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}