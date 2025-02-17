
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { BookOpen, Calendar } from "lucide-react"

interface StoryCardProps {
  story: {
    id: string
    title: string
    content: string
    created_at: string
    questions?: {
      question: string
    } | null
  }
  onClick: () => void
}

export function StoryCard({ story, onClick }: StoryCardProps) {
  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-muted/50"
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold line-clamp-1">{story.title}</h3>
          <div className="text-muted-foreground/50 group-hover:text-primary/80 transition-colors duration-300">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {story.content}
        </p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDistanceToNow(new Date(story.created_at), { addSuffix: true })}
        </div>
      </CardContent>
    </Card>
  )
}
