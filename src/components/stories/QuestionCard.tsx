
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Users, Camera, Award, QuoteIcon, Feather } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface QuestionCardProps {
  category: string;
  question: string;
  onSelect: () => void;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'family':
      return <Users className="h-6 w-6" />;
    case 'memories':
      return <Camera className="h-6 w-6" />;
    case 'relationships':
      return <Heart className="h-6 w-6" />;
    case 'achievements':
      return <Award className="h-6 w-6" />;
    case 'lessons':
      return <BookOpen className="h-6 w-6" />;
    default:
      return <QuoteIcon className="h-6 w-6" />;
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
    <Card className="group h-full flex flex-col hover:shadow-lg transition-all duration-300 border-muted/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-sm font-medium tracking-wide text-muted-foreground">
            {formatCategory(category)}
          </CardTitle>
          <div className="text-muted-foreground/50 group-hover:text-primary/80 transition-colors duration-300">
            {getCategoryIcon(category)}
          </div>
        </div>
        <Separator className="w-full opacity-30" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-4">
        <p className="flex-1 text-xl font-serif leading-relaxed mb-8">
          {question}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <Button 
            onClick={onSelect} 
            className="w-full group-hover:bg-primary/10 transition-colors duration-300"
            variant="ghost"
          >
            <Feather className="w-4 h-4 mr-2" />
            Begin Interview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
