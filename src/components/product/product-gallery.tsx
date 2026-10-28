"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

type GalleryImage = {
  src: string;
  alt: string;
};

export function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) return null;

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row">
      <div className="hide-scrollbar flex gap-2 overflow-x-auto lg:w-[88px] lg:flex-col lg:overflow-visible">
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "relative aspect-[4/5] w-[68px] shrink-0 overflow-hidden bg-surface lg:w-full",
              index === activeIndex
                ? "ring-1 ring-ink ring-offset-2 ring-offset-canvas"
                : "opacity-70 transition-opacity hover:opacity-100",
            )}
            aria-label={`View image ${index + 1} of ${productName}`}
            aria-pressed={index === activeIndex}
          >
            <Image
              src={image.src}
              alt=""
              fill
              sizes="88px"
              className="image-cover"
            />
          </button>
        ))}
      </div>

      <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-surface">
        <Image
          src={active.src}
          alt={active.alt || productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="image-cover"
        />
      </div>
    </div>
  );
}
