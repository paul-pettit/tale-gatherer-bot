
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type QuestionCategory = 
  | "childhood_and_roots"
  | "family_and_relationships"
  | "first_love"
  | "high_school_and_early_years"
  | "career_and_aspirations"
  | "risk_and_growth"
  | "reflections_and_legacy";

interface Question {
  id: string;
  category: QuestionCategory;
  question: string;
  description: string | null;
  created_at: string;
}

interface QuestionsTableProps {
  questions: Question[];
}

const CATEGORIES: { value: QuestionCategory; label: string }[] = [
  { value: 'childhood_and_roots', label: 'Childhood and Roots' },
  { value: 'family_and_relationships', label: 'Family and Relationships' },
  { value: 'first_love', label: 'First Love' },
  { value: 'high_school_and_early_years', label: 'High School and Early Years' },
  { value: 'career_and_aspirations', label: 'Career and Aspirations' },
  { value: 'risk_and_growth', label: 'Risk and Growth' },
  { value: 'reflections_and_legacy', label: 'Reflections and Legacy' },
];

export function QuestionsTable({ questions: initialQuestions }: QuestionsTableProps) {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [newQuestion, setNewQuestion] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !newQuestion.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert({
          category: selectedCategory,
          question: newQuestion,
          description: newDescription || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Question added successfully",
      });

      if (data) {
        setQuestions([...questions, data]);
      }

      // Reset form
      setNewQuestion("");
      setNewDescription("");
      setSelectedCategory("");
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Error",
        description: "Failed to add question",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCategory = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Questions</CardTitle>
        <CardDescription>
          Manage the AI interviewer's question bank
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="space-y-2">
            <Select
              value={selectedCategory}
              onValueChange={(value: QuestionCategory) => setSelectedCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Enter your question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Question description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Question"}
          </Button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell className="font-medium">
                  {formatCategory(question.category)}
                </TableCell>
                <TableCell>{question.question}</TableCell>
                <TableCell>{question.description || "-"}</TableCell>
                <TableCell>
                  {new Date(question.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
