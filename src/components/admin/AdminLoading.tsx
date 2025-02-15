
import { Shield } from "lucide-react";

export function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Shield className="w-8 h-8 mr-2 text-primary animate-pulse" />
      <p className="text-lg">Checking permissions...</p>
    </div>
  );
}
