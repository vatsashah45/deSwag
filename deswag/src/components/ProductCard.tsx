"use client";
import { useState } from "react";
import Image from "next/image";

type Props = {
  image: string;
  title: string;
  subtitle: string;
  price: string;
  vendor?: string;
  badge?: string;
};

export default function ProductCard({ image, title, subtitle, price, vendor, badge }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Card wrapper */}
      <div className="card card-hover overflow-hidden">
        <div className="relative">
          <div className="aspect-[16/10] relative">
            <Image src={image} alt={title} fill className="object-cover" />
          </div>
          {badge && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)]">
              {badge}
            </span>
          )}
        </div>

        <div className="p-5 space-y-3">
          <div>
            <h3 className="text-lg font-semibold leading-tight text-[var(--ink-strong)]">{title}</h3>
            <p className="subtle text-sm mt-1">{subtitle}</p>
          </div>

          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-[var(--ink-strong)] bg-[var(--surface)] border border-[var(--border)]">
                {price}
              </div>
              {vendor && (
                <div className="text-xs subtle">
                  by <span className="font-medium text-[var(--ink-strong)]">{vendor}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setOpen(true)}
              className="btn"
            >
              View
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="card max-w-lg w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-[var(--muted)] hover:text-[var(--ink-strong)]"
            >
              ✕
            </button>

            <div className="space-y-4">
              <div className="aspect-[16/10] relative rounded-lg overflow-hidden">
                <Image src={image} alt={title} fill className="object-cover" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--ink-strong)]">{title}</h2>
              <p className="subtle">{subtitle}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm subtle">{price}</span>
                {vendor && <span className="text-sm subtle">by {vendor}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
