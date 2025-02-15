
import { Shield } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title = "Admin Dashboard" }: AdminLayoutProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <Shield className="w-8 h-8 mr-2 text-primary" />
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      {children}
    </div>
  );
}
