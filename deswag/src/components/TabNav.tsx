"use client";
import type { TabKey } from "@/app/page";

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: "get-started", label: "Get Started", icon: "⚡" },
  { key: "buy",         label: "Marketplace — Buy", icon: "🛍️" },
  { key: "sell",        label: "Marketplace — Sell", icon: "🏷️" },
  { key: "admin",       label: "Admin", icon: "⚙️" },
];

export default function TabNav({
  tab,
  onChange,
}: {
  tab: TabKey;
  onChange: (t: TabKey) => void;
}) {
  return (
    <div role="tablist" aria-label="Sections" className="w-full">
      <div className="flex items-center justify-between rounded-2xl bg-slate-100 p-1">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(t.key)}
              className={`flex-1 text-center py-2 rounded-xl text-sm md:text-base transition ${
                active ? "bg-white shadow-sm font-medium" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="mr-1">{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
