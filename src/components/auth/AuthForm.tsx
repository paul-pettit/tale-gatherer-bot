
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AuthFormFields } from './AuthFormFields';

interface AuthFormProps {
  isSignUp: boolean;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onToggleMode: () => void;
}

export function AuthForm({ isSignUp, isLoading, onSubmit, onToggleMode }: AuthFormProps) {
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>{isSignUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
        <CardDescription>
          {isSignUp 
            ? 'Join MemoryStitch and start preserving your family stories' 
            : 'Sign in to continue sharing memories'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <AuthFormFields isSignUp={isSignUp} />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onToggleMode}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
