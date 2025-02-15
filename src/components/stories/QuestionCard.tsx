
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuestionCardProps {
  category: string;
  question: string;
  onSelect: () => void;
}

export function QuestionCard({ category, question, onSelect }: QuestionCardProps) {
  const formatCategory = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">
          {formatCategory(category)}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="flex-1 text-lg mb-4">{question}</p>
        <Button onClick={onSelect} className="w-full">
          Select This Question
        </Button>
      </CardContent>
    </Card>
  );
}
