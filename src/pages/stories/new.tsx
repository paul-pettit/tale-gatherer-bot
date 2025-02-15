import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useFreeTier } from '@/hooks/useFreeTier';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StoryHeader } from '@/components/stories/StoryHeader';
import { QuestionCard } from '@/components/stories/QuestionCard';
import { ChatSession } from '@/components/stories/ChatSession';

interface Question {
  id: string;
  category: string;
  question: string;
}

export default function NewStoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { remainingStories, decrementStoryToken } = useFreeTier();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePage = async () => {
      if (!user) return;

      try {
        // Fetch questions from the questions table
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .limit(15);

        if (questionsError) throw questionsError;

        // Randomly select 3 questions
        const shuffled = questionsData.sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 3));
      } catch (error: any) {
        console.error('Error in initialization:', error);
        toast.error('Failed to initialize page. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [user]);

  const handleQuestionSelect = async (question: Question) => {
    if (!user) {
      toast.error('You must be logged in to create a story');
      return;
    }

    try {
      // Create a new story draft
      const { data: storyData, error: storyError } = await supabase
        .from('stories')
        .insert({
          title: `Story about ${question.category}`,
          content: '',
          author_id: user.id,
          status: 'draft',
          question_id: question.id
        })
        .select()
        .single();

      if (storyError) throw storyError;

      // Create a chat session
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          story_id: storyData.id,
          status: 'active'
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      setSelectedQuestion(question);
      setChatSessionId(sessionData.id);
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error('Failed to create story');
    }
  };

  const handleStoryComplete = async (content: string) => {
    // Implementation for story completion will go here
    toast.success('Story saved successfully!');
    navigate('/');
  };

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <StoryHeader 
          remainingStories={remainingStories}
          lastSaved={null}
        />
        <CardContent>
          {!selectedQuestion ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  category={question.category}
                  question={question.question}
                  onSelect={() => handleQuestionSelect(question)}
                />
              ))}
            </div>
          ) : chatSessionId ? (
            <ChatSession
              sessionId={chatSessionId}
              question={selectedQuestion.question}
              onStoryComplete={handleStoryComplete}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
