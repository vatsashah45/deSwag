import Image from "next/image";

type Props = {
  image: string;
  title: string;
  subtitle: string;
  price: string;
  vendor?: string;
};

export default function ProductCard({ image, title, subtitle, price, vendor }: Props) {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[16/10] relative">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          <p className="text-slate-600 text-sm mt-1">{subtitle}</p>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xl font-bold">{price}</div>
            {vendor && <div className="text-xs mt-1">by <span className="font-medium">{vendor}</span></div>}
          </div>
          <button className="btn">View</button>
        </div>
      </div>
    </div>
  );
}
