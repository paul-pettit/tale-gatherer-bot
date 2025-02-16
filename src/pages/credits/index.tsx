
import { useEffect } from "react";
import { CreditsPurchaseCard } from "@/components/profile/CreditsPurchaseCard";

export default function CreditsPage() {
  useEffect(() => {
    // Clean up any stored return URL when the page loads normally
    sessionStorage.removeItem('creditPurchaseReturnUrl');
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Purchase Story Credits</h1>
        <CreditsPurchaseCard />
      </div>
    </div>
  );
}
