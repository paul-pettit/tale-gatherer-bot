
import { createContext, useContext, ReactNode } from 'react';

interface AuthFormContextType {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  firstName: string;
  setFirstName: (value: string) => void;
  age: string;
  setAge: (value: string) => void;
  hometown: string;
  setHometown: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
}

const AuthFormContext = createContext<AuthFormContextType | undefined>(undefined);

export function useAuthFormContext() {
  const context = useContext(AuthFormContext);
  if (context === undefined) {
    throw new Error('useAuthFormContext must be used within an AuthFormProvider');
  }
  return context;
}

interface AuthFormProviderProps {
  children: ReactNode;
  value: AuthFormContextType;
}

export function AuthFormProvider({ children, value }: AuthFormProviderProps) {
  return (
    <AuthFormContext.Provider value={value}>
      {children}
    </AuthFormContext.Provider>
  );
}
