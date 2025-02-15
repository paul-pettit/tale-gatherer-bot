
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, DollarSign, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
          .select('*, auth.users(email)')
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

      if (profilesResult.data) setProfiles(profilesResult.data);
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
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Overview of all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>{profile.full_name || 'N/A'}</TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>{profile.subscription_plan || 'Free'}</TableCell>
                      <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stories">
          <Card>
            <CardHeader>
              <CardTitle>Stories</CardTitle>
              <CardDescription>All stories in the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stories.map((story) => (
                    <TableRow key={story.id}>
                      <TableCell>{story.title}</TableCell>
                      <TableCell>{story.author_id}</TableCell>
                      <TableCell>{story.status}</TableCell>
                      <TableCell>{new Date(story.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>All payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.profile_id}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>{payment.status}</TableCell>
                      <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
