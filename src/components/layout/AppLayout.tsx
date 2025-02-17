
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useFreeTier } from "@/hooks/useFreeTier";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, PenSquare, User, LogOut, Shield, Gem, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { remainingStories } = useFreeTier();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionPlan, setSubscriptionPlan] = useState('free');

  useEffect(() => {
    if (user) {
      checkAdminStatus();
      fetchSubscriptionPlan();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      const { data: hasRole } = await supabase.rpc('has_role', {
        _user_id: user?.id,
        _role: 'admin'
      });
      setIsAdmin(hasRole);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const fetchSubscriptionPlan = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('subscription_plan')
      .eq('id', user.id)
      .single();
      
    if (!error && data) {
      setSubscriptionPlan(data.subscription_plan);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/auth');
    }
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'New Story', href: '/stories/new', icon: PenSquare },
    { name: 'Story Library', href: '/stories', icon: BookOpen },
    { name: 'Profile', href: '/profile', icon: User },
    ...(isAdmin ? [{ name: 'Admin', href: '/admin', icon: Shield }] : []),
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  // Don't show the sidebar on the index page or when not authenticated
  if (location.pathname === '/' || !user) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border px-6 py-6 bg-[#1A1F2C]">
            <div className="flex items-center justify-center">
              <img 
                src="/lovable-uploads/e32eb416-f89a-47ac-a548-fb5cd566fa06.png"
                alt="Memory Stitcher" 
                className="h-12 w-auto"
              />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.href)}
                    className={`${isActive(item.href) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"}`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-4 px-2 py-3">
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-sidebar-foreground truncate block" title={user?.email}>
                  {user?.email}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={subscriptionPlan === 'premium' ? 'default' : 'secondary'} className="text-xs">
                    {subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)}
                  </Badge>
                  <span className="text-xs text-sidebar-foreground/80 flex items-center gap-1">
                    <Gem className="h-3 w-3" />
                    {remainingStories}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="ml-auto flex-shrink-0 text-sidebar-foreground hover:text-sidebar-foreground/90"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto">
          {user && (
            <div className="flex items-center justify-between p-4 border-b border-border lg:hidden bg-[#1A1F2C]">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/e32eb416-f89a-47ac-a548-fb5cd566fa06.png"
                  alt="Memory Stitcher" 
                  className="h-8 brightness-110 contrast-125"
                />
              </div>
              <SidebarTrigger />
            </div>
          )}
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
