
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFreeTier } from "@/hooks/useFreeTier";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();
  const { remainingStories, isFreeTier } = useFreeTier();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState("");
  const [hometown, setHometown] = useState("");
  const [gender, setGender] = useState("");

  const { data: profile, refetch } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      // Initialize form values
      setFirstName(data?.first_name || "");
      setAge(data?.age?.toString() || "");
      setHometown(data?.hometown || "");
      setGender(data?.gender || "");
      
      return data;
    },
    enabled: !!user,
  });

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          age: parseInt(age),
          hometown,
          gender,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback>{profile?.first_name?.[0] || user?.email?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-semibold">{profile?.first_name || "Anonymous User"}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  min="0"
                  max="120"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hometown">Hometown</Label>
                <Input
                  id="hometown"
                  value={hometown}
                  onChange={(e) => setHometown(e.target.value)}
                  placeholder="Enter your hometown"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>First Name</Label>
                <p className="text-sm text-muted-foreground">{profile?.first_name || "Not set"}</p>
              </div>
              <div>
                <Label>Age</Label>
                <p className="text-sm text-muted-foreground">{profile?.age || "Not set"}</p>
              </div>
              <div>
                <Label>Hometown</Label>
                <p className="text-sm text-muted-foreground">{profile?.hometown || "Not set"}</p>
              </div>
              <div>
                <Label>Gender</Label>
                <p className="text-sm text-muted-foreground">{profile?.gender || "Not set"}</p>
              </div>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </div>
          )}
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
