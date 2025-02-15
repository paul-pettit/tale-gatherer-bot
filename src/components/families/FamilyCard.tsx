
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface FamilyCardProps {
  id: string;
  name: string;
  memberCount: number;
  onViewDetails: (id: string) => void;
}

export function FamilyCard({ id, name, memberCount, onViewDetails }: FamilyCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{name}</span>
          <Users className="h-5 w-5 text-gray-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{memberCount} members</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onViewDetails(id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
