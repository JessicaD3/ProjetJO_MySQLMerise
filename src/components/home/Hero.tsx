"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const slides = useMemo(
    () => [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1516834611397-87ceb9e2f9a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1515703407324-5f7534680a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    ],
    []
  );

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section className="hero">
      {/* Rings */}
      <div className="olympic-rings">
        <div className="ring ring-1" />
        <div className="ring ring-2" />
        <div className="ring ring-3" />
        <div className="ring ring-4" />
        <div className="ring ring-5" />
      </div>

      {/* Slider */}
      <div className="hero-slider">
        {slides.map((url, idx) => (
          <div
            key={url}
            className={`slide ${idx === current ? "active" : ""}`}
            style={{ backgroundImage: `url('${url}')` }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-date">6 - 22 FÉVRIER 2026</div>
        <h1 className="hero-title">
          MILAN 2026
          <span>CORTINA D&apos;AMPEZZO</span>
        </h1>
        <p className="hero-subtitle">
          Vivez la magie des Jeux Olympiques d&apos;hiver dans un écrin de neige et de glace
        </p>

        <div className="hero-buttons">
          <Link className="btn btn-primary" href="/tickets">
            Réserver mes billets
          </Link>
          <Link className="btn btn-outline" href="/epreuves">
            Découvrir les sports
          </Link>
        </div>
      </div>

      {/* Dots */}
      <div className="slider-controls">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={`slider-dot ${idx === current ? "active" : ""}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </section>
  );
}