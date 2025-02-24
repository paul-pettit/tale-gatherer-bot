
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthFormProvider } from '@/components/auth/AuthFormContext';
import { SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/client';

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
      console.log('Starting authentication process:', isSignUp ? 'signup' : 'signin');
      console.log('Email format:', email.includes('@') && email.includes('.'));
      
      if (isSignUp) {
        console.log('Attempting signup...');
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        console.log('Signup response:', signUpError ? 'Error occurred' : 'Success');

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
        navigate('/auth/verification-pending');
      } else {
        console.log('Attempting signin...');
        
        // Try the standard Supabase auth first
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          console.error('Supabase auth error:', error);
          
          // If that fails, try a raw request for debugging
          try {
            const response = await fetch('https://bykodzpccfujhxighpzi.supabase.co/auth/v1/token?grant_type=password', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_PUBLISHABLE_KEY,
              },
              body: JSON.stringify({ email, password }),
            });
            
            const responseText = await response.text();
            console.log('Raw auth response:', {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
              body: responseText,
            });
          } catch (fetchError) {
            console.error('Raw auth request failed:', fetchError);
          }
          
          throw error;
        }

        console.log('Signin successful');
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Authentication error:', {
        message: error.message,
        status: error.status,
        name: error.name,
        details: error.details,
        statusText: error.statusText,
        response: error.response,
        data: error.data
      });
      toast.error(error.message || 'Authentication failed');
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
