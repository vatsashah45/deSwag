// src/components/TabNav.tsx
"use client";
import type { TabKey } from "@/app/page";

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: "get-started", label: "Get Started", icon: "⚡" },
  { key: "buy",         label: "Buy",         icon: "🛍️" },
  { key: "sell",        label: "Sell",        icon: "🏷️" },
  { key: "admin",       label: "Admin",       icon: "⚙️" },
];

export default function TabNav({ tab, onChange }: { tab: TabKey; onChange: (t: TabKey) => void }) {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-3xl bg-[var(--surface-2)] backdrop-blur rounded-2xl p-1 flex gap-1 border border-[var(--border)]">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`flex-1 py-2 rounded-xl text-sm md:text-base outline-none transition
                ${active
                  ? "bg-white shadow-sm font-semibold text-[var(--ink-strong)]"
                  : "subtle hover:text-[var(--ink-strong)]"}
              `}
            >
              <span className={`mr-1 ${active ? "text-[var(--brand-600)]" : ""}`}>{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
