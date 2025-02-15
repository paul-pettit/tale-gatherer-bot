
import { useAuth } from "@/hooks/useAuth";
import { useFreeTier } from "@/hooks/useFreeTier";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { remainingStories, isFreeTier } = useFreeTier();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback>{profile?.full_name?.[0] || user?.email?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-semibold">{profile?.full_name || "Anonymous User"}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">Current Plan</h4>
            <p className="text-sm text-muted-foreground">
              {isFreeTier ? "Free Tier" : profile?.subscription_plan?.toUpperCase()}
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium">Story Credits</h4>
            <p className="text-sm text-muted-foreground">
              {remainingStories} {remainingStories === 1 ? "story" : "stories"} remaining
            </p>
          </div>
          {profile?.subscription_end_date && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium">Subscription Ends</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(profile.subscription_end_date).toLocaleDateString()}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
