import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import LiveTicker from "@/components/layout/LiveTicker";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 90 }}>
        <LiveTicker />
      </div>
      {children}
    </>
  );
}