
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFreeTier } from "@/hooks/useFreeTier";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { SubscriptionDetails } from "@/components/profile/SubscriptionDetails";

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

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;

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
      const { data: fields, error: fieldsError } = await supabase
        .from('profile_fields')
        .select('id, name')
        .in('name', ['first_name', 'age', 'hometown', 'gender']);

      if (fieldsError) throw fieldsError;

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
          <ProfileHeader
            avatarUrl={profileData?.avatar_url}
            firstName={getFieldValue('first_name')}
            email={user?.email}
          />

          {isEditing ? (
            <ProfileForm
              firstName={firstName}
              age={age}
              hometown={hometown}
              gender={gender}
              onFirstNameChange={setFirstName}
              onAgeChange={setAge}
              onHometownChange={setHometown}
              onGenderChange={setGender}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProfileInfo
              firstName={getFieldValue('first_name')}
              age={getFieldValue('age')}
              hometown={getFieldValue('hometown')}
              gender={getFieldValue('gender')}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </CardContent>
      </Card>

      <SubscriptionDetails
        isFreeTier={isFreeTier}
        subscriptionPlan={profileData?.subscription_plan}
        remainingStories={remainingStories}
        subscriptionEndDate={profileData?.subscription_end_date}
      />
    </div>
  );
}
