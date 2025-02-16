
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ProfileInfoProps {
  firstName: string;
  age: string;
  hometown: string;
  gender: string;
  onEdit: () => void;
}

export function ProfileInfo({ firstName, age, hometown, gender, onEdit }: ProfileInfoProps) {
  const formatGender = (gender: string) => {
    if (!gender || gender === "Not set") return "Not set";
    
    const genderMap: Record<string, string> = {
      "male": "Male",
      "female": "Female",
      "non-binary": "Non-binary",
      "prefer-not-to-say": "Prefer not to say"
    };

    return genderMap[gender] || gender;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>First Name</Label>
        <p className="text-sm text-muted-foreground">{firstName || "Not set"}</p>
      </div>
      <div>
        <Label>Age</Label>
        <p className="text-sm text-muted-foreground">{age || "Not set"}</p>
      </div>
      <div>
        <Label>Hometown</Label>
        <p className="text-sm text-muted-foreground">{hometown || "Not set"}</p>
      </div>
      <div>
        <Label>Gender</Label>
        <p className="text-sm text-muted-foreground">{formatGender(gender)}</p>
      </div>
      <Button onClick={onEdit}>Edit Profile</Button>
    </div>
  );
}
