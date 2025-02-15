
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FamilyMember {
  id: string;
  profile: {
    full_name: string;
    avatar_url: string;
  };
  role: string;
  is_admin: boolean;
}

interface FamilyDetails {
  id: string;
  name: string;
  created_at: string;
  max_members: number;
  subscription_tier: string;
  family_members: FamilyMember[];
}

export default function FamilyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: family, isLoading } = useQuery({
    queryKey: ['family', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('families')
        .select(`
          *,
          family_members!inner (
            id,
            role,
            is_admin,
            profiles!inner (
              full_name,
              avatar_url
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Transform the data to match our FamilyDetails interface
      const transformedData: FamilyDetails = {
        id: data.id,
        name: data.name,
        created_at: data.created_at,
        max_members: data.max_members,
        subscription_tier: data.subscription_tier,
        family_members: data.family_members.map((member: any) => ({
          id: member.id,
          role: member.role,
          is_admin: member.is_admin,
          profile: {
            full_name: member.profiles.full_name,
            avatar_url: member.profiles.avatar_url,
          }
        }))
      };

      return transformedData;
    },
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!family) {
    return <div className="container mx-auto px-4 py-8">Family not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/families')}
        >
          <ArrowLeft className="mr-2" />
          Back to Families
        </Button>
        <h1 className="text-3xl font-bold">{family.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Members ({family.family_members.length}/{family.max_members})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {family.family_members.map((member) => (
                <li key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {member.profile.avatar_url ? (
                        <img
                          src={member.profile.avatar_url}
                          alt={member.profile.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    <span>{member.profile.full_name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {member.is_admin ? 'Admin' : member.role}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Family Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <dt className="text-sm text-gray-500">Subscription Tier</dt>
              <dd className="font-medium capitalize">{family.subscription_tier}</dd>
              <dt className="text-sm text-gray-500">Created</dt>
              <dd className="font-medium">
                {new Date(family.created_at).toLocaleDateString()}
              </dd>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
