"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AuthNav from "@/components/layout/AuthNav";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <Link className="logo" href="/">
          MILAN<span>CORTINA</span>
        </Link>

        <div className="nav-links">
          <Link className={isActive(pathname, "/") ? "active" : ""} href="/">
            Accueil
          </Link>
          <Link className={isActive(pathname, "/epreuves") ? "active" : ""} href="/epreuves">
            Sports
          </Link>
          <Link className={isActive(pathname, "/athletes") ? "active" : ""} href="/athletes">
            Athlètes
          </Link>
          <Link className={isActive(pathname, "/calendrier") ? "active" : ""} href="/calendrier">
            Calendrier
          </Link>
          <Link className={isActive(pathname, "/tickets") ? "active" : ""} href="/tickets">
            Billets
          </Link>
          <Link className={isActive(pathname, "/classement/medailles") ? "active" : ""} href="/classement/medailles">
            Médailles
          </Link>
          <AuthNav />
        </div>
      </div>
    </nav>
  );
}