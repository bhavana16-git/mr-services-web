import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServicePackages } from "@/hooks/useServicePackages";
import Seo from "@/components/common/Seo";
import PackageCard from "@/components/portal/PackageCard";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/routePaths";

const CATEGORY_LABELS: Record<string, string> = {
  society_accounting: "Co-operative Society Accounting Packages",
  business_accounting: "Business & Individual Accounting Packages",  
  typing_services: "English Typing Services Packages",
};

export default function ServicePackages() {
  const { data: packages, isLoading } = useServicePackages();
  const navigate = useNavigate();
  const [, setSelectedPackageId] = useState<string | null>(null);

  function requestPackage(pkg: { id: string }) {
    setSelectedPackageId(pkg.id);
    navigate(`${ROUTES.portalNewRequest}?packageId=${pkg.id}`);
  }

  const grouped = (packages ?? []).reduce<Record<string, typeof packages>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="p-6 lg:p-10">
      <Seo title="Service Packages | M. R. Services Client Portal" description="Browse M. R. Services' accounting and typing service packages and reference pricing." />
      <h1 className="font-heading text-2xl font-bold text-neutral-900">Service Packages</h1>
      <p className="mt-1 text-neutral-700">
        Clear, transparent packages built around how our clients actually work with
        us. Browse the options below, then request the package that fits, or reach
        out for a fully custom quote.
      </p>

      <div className="mt-4 rounded-lg bg-accent-100 p-4 text-sm text-primary-900">
        <strong>Pricing Notice:</strong> All prices on this page are indicative
        starting rates, shown for information and reference only. Final pricing is
        confirmed after a free, no-obligation consultation, based on scope, size,
        and transaction volume. This portal does not process online payments --
        invoicing and payment (bank transfer, UPI, or cash) are arranged directly
        with M. R. Services, outside the portal.
      </div>

      {isLoading && <p className="mt-8 text-neutral-700">Loading packages...</p>}

      {Object.entries(grouped).map(([category, pkgs]) => (
        <section key={category} className="mt-10">
          <h2 className="font-heading text-xl font-semibold text-neutral-900">
            {CATEGORY_LABELS[category] ?? category}
          </h2>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {pkgs!.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} onRequest={requestPackage} />)}
          </div>
        </section>
      ))}

      <div className="mt-10 rounded-lg border border-neutral-200 bg-white p-6 text-center">
        <p className="text-neutral-700">
          Not sure which package fits, or need something combined/custom?
        </p>
        <Button asChild variant="outline" className="mt-3">
          <a onClick={() => navigate(`${ROUTES.portalNewRequest}?custom=true`)}>Get a Custom Quote</a>
        </Button>
      </div>
    </div>
  );
}


