
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateFamilyDialog } from "@/components/families/CreateFamilyDialog";
import { FamilyCard } from "@/components/families/FamilyCard";
import { useFamilies } from "@/hooks/useFamilies";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Users } from "lucide-react";

export default function FamiliesPage() {
  const { data: families, isLoading } = useFamilies();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewDetails = (id: string) => {
    navigate(`/families/${id}`);
  };

  const handleUpgrade = () => {
    navigate('/subscription');
  };

  // Check if user only has a free personal family
  const isFreeTier = families?.length === 1 && families[0]?.subscription_tier === 'free';

  const UpgradeCard = () => (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Create a Family Space
        </CardTitle>
        <CardDescription>
          Upgrade to share stories with your loved ones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              ✓ Share stories with up to 8 family members
            </li>
            <li className="flex items-center gap-2">
              ✓ Collaborate on family histories
            </li>
            <li className="flex items-center gap-2">
              ✓ Create multiple family spaces
            </li>
          </ul>
          <Button onClick={handleUpgrade} className="w-full">
            Upgrade Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Families</h1>
        {!isFreeTier && <CreateFamilyDialog />}
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : !families?.length ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">You haven't created or joined any families yet</h2>
          <p className="text-gray-500 mb-8">Create a new family to start sharing stories with your loved ones.</p>
          <CreateFamilyDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {families.map((family) => (
            <FamilyCard
              key={family.id}
              id={family.id}
              name={family.name}
              memberCount={family._count?.members || 0}
              onViewDetails={handleViewDetails}
            />
          ))}
          {isFreeTier && <UpgradeCard />}
        </div>
      )}
    </div>
  );
}
