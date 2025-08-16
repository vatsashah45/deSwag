"use client";
import type { TabKey } from "@/app/page";

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: "get-started", label: "Get Started", icon: "⚡" },
  { key: "buy",         label: "Buy",         icon: "🛍️" },
  { key: "sell",        label: "Sell",        icon: "🏷️" },
  { key: "admin",       label: "Admin",       icon: "⚙️" },
];

export default function TabNav({ tab, onChange }: { tab: TabKey; onChange: (t: TabKey) => void; }) {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-3xl bg-slate-100 rounded-2xl p-1 flex gap-1">
        {tabs.map(t => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`flex-1 py-2 rounded-xl text-sm md:text-base transition ${
                active
                  ? "bg-white shadow-sm font-medium"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="mr-1">{t.icon}</span>{t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
