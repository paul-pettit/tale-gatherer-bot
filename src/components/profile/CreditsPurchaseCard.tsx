
import { CreditPackageCard } from "@/components/credits/CreditPackageCard";
import { useCredits } from "@/hooks/useCredits";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function CreditsPurchaseCard() {
  const { creditPackages, isLoading, handlePurchase, error, refetch } = useCredits();

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription className="flex items-center justify-between">
          <span>There was an error loading credit packages.</span>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-2">
            <RefreshCw className="h-4 w-4 mr-1" />
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

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
