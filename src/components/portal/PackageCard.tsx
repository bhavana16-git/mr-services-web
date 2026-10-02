import { Button } from "@/components/ui/button";

type Feature = { feature_text: string; sort_order: number };
type Package = {
  id: string; name: string; best_for: string;
  starting_price: number; price_unit: string; turnaround: string;
  service_package_features: Feature[];
};

export default function PackageCard({ pkg, onRequest }: { pkg: Package; onRequest: (pkg: Package) => void }) {
  const features = [...pkg.service_package_features].sort((a, b) => a.sort_order - b.sort_order);
  return (
    <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <h3 className="font-heading text-lg font-semibold text-neutral-900">{pkg.name}</h3>
      <p className="text-sm text-neutral-400">{pkg.best_for}</p>
      <p className="mt-3 text-2xl font-bold text-primary-900">
        Rs. {pkg.starting_price.toLocaleString("en-IN")}
        <span className="text-sm font-normal text-neutral-400"> / {pkg.price_unit}</span>
      </p>
      <p className="mt-1 text-xs text-neutral-400">Turnaround: {pkg.turnaround}</p>
      <ul className="mt-4 flex-1 space-y-2 text-sm text-neutral-700">
        {features.map((f) => <li key={f.feature_text}>&bull; {f.feature_text}</li>)}
      </ul>
      <Button className="mt-6" onClick={() => onRequest(pkg)}>Request This Package</Button>
    </div>
  );
}


