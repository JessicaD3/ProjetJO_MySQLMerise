// src/app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "MILAN 2026 | Jeux Olympiques d'hiver",
  description: "SI JO Milano–Cortina 2026",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}