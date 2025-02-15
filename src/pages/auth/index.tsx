
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthFormProvider } from '@/components/auth/AuthFormContext';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('');
  const [hometown, setHometown] = useState('');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          // Get field IDs
          const { data: fields } = await supabase
            .from('profile_fields')
            .select('id, name')
            .in('name', ['first_name', 'age', 'hometown', 'gender']);

          if (fields) {
            const fieldValues = fields.map(field => ({
              profile_id: authData.user!.id,
              field_id: field.id,
              value: field.name === 'first_name' ? firstName :
                     field.name === 'age' ? age :
                     field.name === 'hometown' ? hometown :
                     field.name === 'gender' ? gender : null
            }));

            const { error: insertError } = await supabase
              .from('profile_field_values')
              .insert(fieldValues);

            if (insertError) throw insertError;
          }
        }

        toast.success('Registration successful! Please check your email to verify your account.');
        navigate('/subscription');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formContextValue = {
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    age,
    setAge,
    hometown,
    setHometown,
    gender,
    setGender,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <AuthFormProvider value={formContextValue}>
        <AuthForm
          isSignUp={isSignUp}
          isLoading={isLoading}
          onSubmit={handleAuth}
          onToggleMode={() => setIsSignUp(!isSignUp)}
        />
      </AuthFormProvider>
    </div>
  );
}
