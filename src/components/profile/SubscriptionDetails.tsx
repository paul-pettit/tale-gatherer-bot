
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditsPurchaseCard } from "./CreditsPurchaseCard";

interface SubscriptionDetailsProps {
  isFreeTier: boolean;
  subscriptionPlan?: string;
  remainingStories: number;
  subscriptionEndDate?: string;
}

export function SubscriptionDetails({
  isFreeTier,
  subscriptionPlan,
  remainingStories,
  subscriptionEndDate,
}: SubscriptionDetailsProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Subscription Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium">Current Plan</h4>
          <p className="text-sm text-muted-foreground">
            {isFreeTier ? "Free Tier" : subscriptionPlan?.toUpperCase()}
          </p>
        </div>
        <Separator />
        <div>
          <h4 className="font-medium">Story Credits</h4>
          <p className="text-sm text-muted-foreground">
            {remainingStories} {remainingStories === 1 ? "story" : "stories"} remaining
          </p>
          <div className="mt-4">
            <CreditsPurchaseCard />
          </div>
        </div>
        {subscriptionEndDate && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium">Subscription Ends</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(subscriptionEndDate).toLocaleDateString()}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
