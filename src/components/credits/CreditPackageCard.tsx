
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gem } from "lucide-react";
import { CreditPackage } from "@/types/credits";

interface CreditPackageCardProps {
  package: CreditPackage;
  onPurchase: (packageId: string) => void;
  isLoading: boolean;
}

export function CreditPackageCard({ package: pkg, onPurchase, isLoading }: CreditPackageCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gem className="h-5 w-5" />
          {pkg.name}
        </CardTitle>
        <CardDescription>
          {pkg.description || `${pkg.credits} story ${pkg.credits === 1 ? 'credit' : 'credits'}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold">${pkg.price.toFixed(2)}</div>
          {pkg.credits >= 5 && (
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              20% OFF
            </span>
          )}
        </div>
        <Button
          className="w-full"
          onClick={() => onPurchase(pkg.id)}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Purchase Now'}
        </Button>
      </CardContent>
    </Card>
  );
}
