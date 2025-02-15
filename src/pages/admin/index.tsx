
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, DollarSign, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UsersTable } from "@/components/admin/UsersTable";
import { StoriesTable } from "@/components/admin/StoriesTable";
import { PaymentsTable } from "@/components/admin/PaymentsTable";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  subscription_plan: string | null;
  created_at: string;
}

interface Story {
  id: string;
  title: string;
  author_id: string;
  status: string;
  created_at: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  profile_id: string;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: hasRole } = await supabase.rpc('has_role', {
        _user_id: (await supabase.auth.getUser()).data.user?.id,
        _role: 'admin'
      });

      if (!hasRole) {
        navigate('/');
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access this page.",
        });
        return;
      }

      setIsAdmin(true);
      fetchData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    }
  };

  const fetchData = async () => {
    try {
      const [profilesResult, storiesResult, paymentsResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, full_name, subscription_plan, created_at')
          .order('created_at', { ascending: false }),
        supabase
          .from('stories')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      if (profilesResult.data) {
        const profilesWithEmail = await Promise.all(
          profilesResult.data.map(async (profile) => {
            const { data: userData } = await supabase.auth.admin.getUserById(profile.id);
            return {
              ...profile,
              email: userData?.user?.email || 'N/A',
            };
          })
        );
        setProfiles(profilesWithEmail);
      }
      if (storiesResult.data) setStories(storiesResult.data);
      if (paymentsResult.data) setPayments(paymentsResult.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load admin data.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Shield className="w-8 h-8 mr-2 text-primary animate-pulse" />
        <p className="text-lg">Checking permissions...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <Shield className="w-8 h-8 mr-2 text-primary" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="stories" className="flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Stories
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            Payments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTable profiles={profiles} />
        </TabsContent>

        <TabsContent value="stories">
          <StoriesTable stories={stories} />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsTable payments={payments} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
