import ProductCard from "@/components/ProductCard";
import { eth } from "@/lib/format";

const items = [
  { image: "/images/tshirt.jpg", title: "Limited Edition T-Shirt", subtitle: "Conference tee with holographic design", price: eth(0.05), vendor: "TechCorp", badge: "Limited" },
  { image: "/images/art.jpg", title: "Digital Art NFT", subtitle: "Unique artwork from featured artist", price: eth(0.10), vendor: "ArtStudio", badge: "Featured" },
  { image: "/images/vip.jpg", title: "VIP Access Pass", subtitle: "Premium networking lounge access", price: eth(0.25), vendor: "EventCo" },
];

export default function MarketplaceBuy() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => <ProductCard key={i.title} {...i} />)}
    </div>
  );
}
