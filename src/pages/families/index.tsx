
import { CreateFamilyDialog } from "@/components/families/CreateFamilyDialog";
import { FamilyCard } from "@/components/families/FamilyCard";
import { useFamilies } from "@/hooks/useFamilies";
import { useNavigate } from "react-router-dom";

export default function FamiliesPage() {
  const { data: families, isLoading } = useFamilies();
  const navigate = useNavigate();

  const handleViewDetails = (id: string) => {
    navigate(`/families/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Families</h1>
        <CreateFamilyDialog />
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
        </div>
      )}
    </div>
  );
}
