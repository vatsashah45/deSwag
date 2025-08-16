import Image from "next/image";

type Props = { image: string; title: string; subtitle: string; price: string; vendor?: string; badge?: string; };

export default function ProductCard({ image, title, subtitle, price, vendor, badge }: Props) {
  return (
    <div className="bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl shadow-sm border border-[var(--card-border)] overflow-hidden transition hover:shadow-md hover:-translate-y-[1px]">
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
          <h3 className="text-lg font-semibold leading-tight text-[var(--ink)]">{title}</h3>
          <p className="text-[var(--muted)] text-sm mt-1">{subtitle}</p>
        </div>

        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-[var(--ink)] bg-white/80 border border-[var(--card-border)]">
              {price}
            </div>
            {vendor && <div className="text-xs text-[var(--muted)]">by <span className="font-medium text-[var(--ink)]">{vendor}</span></div>}
          </div>
          <button className="px-4 py-2 rounded-xl font-medium bg-white/80 border border-[var(--card-border)] text-[var(--ink)] hover:bg-white">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
