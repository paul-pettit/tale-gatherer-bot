
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileFormProps {
  firstName: string;
  age: string;
  hometown: string;
  gender: string;
  onFirstNameChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onHometownChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileForm({
  firstName,
  age,
  hometown,
  gender,
  onFirstNameChange,
  onAgeChange,
  onHometownChange,
  onGenderChange,
  onSave,
  onCancel,
}: ProfileFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          placeholder="Enter your first name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={age}
          onChange={(e) => onAgeChange(e.target.value)}
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
          onChange={(e) => onHometownChange(e.target.value)}
          placeholder="Enter your hometown"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select value={gender} onValueChange={onGenderChange}>
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
        <Button onClick={onSave}>Save Changes</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
