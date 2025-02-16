
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
    if (!user) {
      toast.error('You must be logged in to create a story');
      navigate('/auth');
      return;
    }

    const initializePage = async () => {
      try {
        console.log('Fetching questions...');
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .limit(15);

        if (questionsError) {
          console.error('Error fetching questions:', questionsError);
          throw questionsError;
        }

        if (!questionsData) {
          throw new Error('No questions data received');
        }

        console.log('Questions fetched:', questionsData.length);
        
        // Randomly select 6 questions
        const shuffled = questionsData.sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 6));
      } catch (error: any) {
        console.error('Error in initialization:', error);
        toast.error('Failed to initialize page: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [user, navigate]);

  const handleQuestionSelect = async (question: Question) => {
    if (!user) {
      toast.error('You must be logged in to create a story');
      navigate('/auth');
      return;
    }

    try {
      console.log('Creating story for question:', question.id);
      
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

      if (storyError) {
        console.error('Error creating story:', storyError);
        throw storyError;
      }

      if (!storyData) {
        throw new Error('No story data received after creation');
      }

      console.log('Story created:', storyData.id);

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

      if (sessionError) {
        console.error('Error creating chat session:', sessionError);
        throw sessionError;
      }

      if (!sessionData) {
        throw new Error('No session data received after creation');
      }

      console.log('Chat session created:', sessionData.id);

      setSelectedQuestion(question);
      setChatSessionId(sessionData.id);
      
      // Decrement story token after successful creation
      decrementStoryToken();
      
    } catch (error: any) {
      console.error('Error in story creation flow:', error);
      toast.error('Failed to create story: ' + error.message);
    }
  };

  const handleStoryComplete = async (content: string) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      // Update the story with the completed content
      const { error: updateError } = await supabase
        .from('stories')
        .update({ 
          content,
          status: 'published'
        })
        .eq('author_id', user.id)
        .eq('status', 'draft')
        .single();

      if (updateError) throw updateError;

      toast.success('Story saved successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Error completing story:', error);
      toast.error('Failed to save story: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-pulse text-lg text-muted-foreground">
                Loading story prompts...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Card>
        <StoryHeader 
          remainingStories={remainingStories}
          lastSaved={null}
        />
        <CardContent className="p-8">
          {!selectedQuestion ? (
            <>
              <h2 className="text-3xl font-bold text-center mb-8">Choose Your Story Prompt</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    category={question.category}
                    question={question.question}
                    onSelect={() => handleQuestionSelect(question)}
                  />
                ))}
              </div>
            </>
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
