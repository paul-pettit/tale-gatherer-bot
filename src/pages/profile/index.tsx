
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

  const { data: profileData, refetch } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;

      // First get the profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      // Then get all profile field values
      const { data: fieldValues, error: fieldValuesError } = await supabase
        .from("profile_field_values")
        .select(`
          value,
          profile_fields (
            name
          )
        `)
        .eq("profile_id", user.id);

      if (fieldValuesError) throw fieldValuesError;

      // Map field values to their respective states
      fieldValues?.forEach((field) => {
        const fieldName = field.profile_fields?.name;
        const value = field.value;
        
        if (fieldName === 'first_name') setFirstName(value || "");
        if (fieldName === 'age') setAge(value || "");
        if (fieldName === 'hometown') setHometown(value || "");
        if (fieldName === 'gender') setGender(value || "");
      });

      return {
        ...profile,
        fieldValues: fieldValues || []
      };
    },
    enabled: !!user,
  });

  const handleSave = async () => {
    if (!user) return;

    try {
      // Get field IDs first
      const { data: fields, error: fieldsError } = await supabase
        .from('profile_fields')
        .select('id, name')
        .in('name', ['first_name', 'age', 'hometown', 'gender']);

      if (fieldsError) throw fieldsError;

      // Update each field value
      for (const field of fields || []) {
        const value = field.name === 'first_name' ? firstName :
                     field.name === 'age' ? age :
                     field.name === 'hometown' ? hometown :
                     field.name === 'gender' ? gender : null;

        const { error } = await supabase
          .from('profile_field_values')
          .upsert({
            profile_id: user.id,
            field_id: field.id,
            value: value
          }, {
            onConflict: 'profile_id,field_id'
          });

        if (error) throw error;
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  // Get the field value helper function
  const getFieldValue = (fieldName: string) => {
    const field = profileData?.fieldValues?.find(
      (f) => f.profile_fields?.name === fieldName
    );
    return field?.value || "Not set";
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
              <AvatarImage src={profileData?.avatar_url || undefined} />
              <AvatarFallback>{getFieldValue('first_name')?.[0] || user?.email?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-semibold">{getFieldValue('first_name') || "Anonymous User"}</h3>
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
                <p className="text-sm text-muted-foreground">{getFieldValue('first_name') || "Not set"}</p>
              </div>
              <div>
                <Label>Age</Label>
                <p className="text-sm text-muted-foreground">{getFieldValue('age') || "Not set"}</p>
              </div>
              <div>
                <Label>Hometown</Label>
                <p className="text-sm text-muted-foreground">{getFieldValue('hometown') || "Not set"}</p>
              </div>
              <div>
                <Label>Gender</Label>
                <p className="text-sm text-muted-foreground">{getFieldValue('gender') || "Not set"}</p>
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
              {isFreeTier ? "Free Tier" : profileData?.subscription_plan?.toUpperCase()}
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium">Story Credits</h4>
            <p className="text-sm text-muted-foreground">
              {remainingStories} {remainingStories === 1 ? "story" : "stories"} remaining
            </p>
          </div>
          {profileData?.subscription_end_date && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium">Subscription Ends</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(profileData.subscription_end_date).toLocaleDateString()}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
