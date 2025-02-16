
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Gem } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Story Credits</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/subscription')}
              className="text-xs"
            >
              Purchase Credits
            </Button>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <Gem className="h-3 w-3" />
            {remainingStories} {remainingStories === 1 ? "story" : "stories"} remaining
          </p>
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
