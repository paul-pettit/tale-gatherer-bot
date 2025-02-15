
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthFormContext } from './AuthFormContext';

interface AuthFormFieldsProps {
  isSignUp: boolean;
}

export function AuthFormFields({ isSignUp }: AuthFormFieldsProps) {
  const {
    email, setEmail,
    password, setPassword,
    firstName, setFirstName,
    age, setAge,
    hometown, setHometown,
    gender, setGender,
  } = useAuthFormContext();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      {isSignUp && (
        <>
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min="0"
              max="120"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hometown">Hometown</Label>
            <Input
              id="hometown"
              type="text"
              placeholder="Enter your hometown"
              value={hometown}
              onChange={(e) => setHometown(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Non-binary">Non-binary</SelectItem>
                <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </>
  );
}
