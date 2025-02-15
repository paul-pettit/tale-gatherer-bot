
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface FamilyCardProps {
  id: string;
  name: string;
  memberCount: number;
  onViewDetails: (id: string) => void;
}

export function FamilyCard({ id, name, memberCount, onViewDetails }: FamilyCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{name}</span>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {memberCount} {memberCount === 1 ? 'member' : 'members'}
          </p>
          <Button onClick={() => onViewDetails(id)} variant="outline" className="w-full">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
