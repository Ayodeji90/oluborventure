"use client";

import { useEffect, useState } from "react";

const slides = [
  { src: "/images/flight1.webp", alt: "Aeroplane approaching to land" },
  { src: "/images/airport.webp", alt: "Airport terminal" },
  { src: "/images/boarding.webp", alt: "Passengers boarding a plane" },
  { src: "/images/runway.webp", alt: "Runway and approach path" },
  { src: "/images/flight2.webp", alt: "Aeroplane in flight" },
  { src: "/images/jet.webp", alt: "Jet aircraft" },
];

export default function HeroRotator() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Preload the remaining slides so the crossfade never shows a flash.
    slides.slice(1).forEach((s) => {
      const img = new window.Image();
      img.src = s.src;
    });
    const id = setInterval(
      () => setActive((a) => (a + 1) % slides.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Visible stacked backgrounds crossfading every 5s */}
      <div aria-hidden>
        {slides.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.src}
            src={s.src}
            alt=""
            className="hero-slide absolute inset-0 h-full w-full object-cover"
            style={{ opacity: i === active ? 1 : 0 }}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>

      {/* Hidden list so SEO/screen readers see every source */}
      <ul role="list" className="sr-only" aria-label="Hero image slideshow">
        {slides.map((s) => (
          <li key={s.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.alt} />
          </li>
        ))}
      </ul>
    </div>
  );
}
