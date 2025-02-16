
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Users, Camera, Award, QuoteIcon } from "lucide-react";

interface QuestionCardProps {
  category: string;
  question: string;
  onSelect: () => void;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'family':
      return <Users className="h-6 w-6 text-muted-foreground" />;
    case 'memories':
      return <Camera className="h-6 w-6 text-muted-foreground" />;
    case 'relationships':
      return <Heart className="h-6 w-6 text-muted-foreground" />;
    case 'achievements':
      return <Award className="h-6 w-6 text-muted-foreground" />;
    case 'lessons':
      return <BookOpen className="h-6 w-6 text-muted-foreground" />;
    default:
      return <QuoteIcon className="h-6 w-6 text-muted-foreground" />;
  }
};

export function QuestionCard({ category, question, onSelect }: QuestionCardProps) {
  const formatCategory = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">
          {formatCategory(category)}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="flex-1 text-lg mb-6">{question}</p>
        {getCategoryIcon(category)}
        <Button 
          onClick={onSelect} 
          className="w-full mt-6"
          variant="outline"
        >
          Start Writing
        </Button>
      </CardContent>
    </Card>
  );
}
