
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAdminData() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState([]);
  const [stories, setStories] = useState([]);
  const [payments, setPayments] = useState([]);
  const [promptLogs, setPromptLogs] = useState([]);
  const [systemPrompts, setSystemPrompts] = useState([]);
  const [questions, setQuestions] = useState([]);
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
      const [
        profilesResult, 
        storiesResult, 
        paymentsResult, 
        promptLogsResult, 
        systemPromptsResult,
        questionsResult
      ] = await Promise.all([
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
        supabase
          .from('prompt_logs')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('system_prompts')
          .select('*')
          .order('type', { ascending: true }),
        supabase
          .from('questions')
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
      if (promptLogsResult.data) setPromptLogs(promptLogsResult.data);
      if (systemPromptsResult.data) setSystemPrompts(systemPromptsResult.data);
      if (questionsResult.data) setQuestions(questionsResult.data);
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

  return {
    profiles,
    stories,
    payments,
    promptLogs,
    systemPrompts,
    questions,
    isAdmin,
    loading,
  };
}
