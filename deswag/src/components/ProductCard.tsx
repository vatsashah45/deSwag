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
  return (
    <div className="card card-hover overflow-hidden">
      <div className="relative">
        <div className="aspect-[16/10] relative">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        {badge && (
          <span className="pill absolute top-3 left-3 bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white shadow-sm">
            {badge}
          </span>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          <p className="text-slate-600 text-sm mt-1">{subtitle}</p>
        </div>

        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="pill-price">{price}</div>
            {vendor && <div className="text-xs text-slate-500">by <span className="font-medium text-slate-700">{vendor}</span></div>}
          </div>
          <button className="btn-ghost">View</button>
        </div>
      </div>
    </div>
  );
}
