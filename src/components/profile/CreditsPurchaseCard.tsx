
import { CreditPackageCard } from "@/components/credits/CreditPackageCard";
import { useCredits } from "@/hooks/useCredits";

export function CreditsPurchaseCard() {
  const { creditPackages, isLoading, handlePurchase } = useCredits();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {creditPackages?.map((pkg) => (
        <CreditPackageCard
          key={pkg.id}
          package={pkg}
          onPurchase={handlePurchase}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
