
import { useCredits } from "@/hooks/useCredits";
import { CreditPackageCard } from "@/components/credits/CreditPackageCard";

export default function CreditsPage() {
  const { creditPackages, isLoading, handlePurchase } = useCredits();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Purchase Story Credits</h1>
        <p className="text-muted-foreground">Choose a credit package to continue writing your stories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {creditPackages?.map((pkg) => (
          <CreditPackageCard
            key={pkg.id}
            package={pkg}
            onPurchase={handlePurchase}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}
