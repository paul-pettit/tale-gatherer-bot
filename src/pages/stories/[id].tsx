
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Edit, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { StoryForm } from "@/components/stories/StoryForm"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export default function StoryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const { data: story, isLoading } = useQuery({
    queryKey: ['story', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('stories')
        .select('*, questions(question, category)')
        .eq('id', id)
        .single()
      return data
    },
  })

  const handleUpdateStory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!story || !user) return

    try {
      const { error } = await supabase
        .from('stories')
        .update({
          title: story.title,
          content: story.content,
        })
        .eq('id', story.id)

      if (error) throw error

      toast.success('Story updated successfully')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update story')
      console.error('Error updating story:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  if (!story) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold">Story not found</h1>
      </div>
    )
  }

  // Format the title to remove the category prefix
  const displayTitle = story.title.replace(`Story about ${story.questions?.category}`, story.questions?.category || '')

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/stories')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Library
        </Button>
      </div>

      <Card className="bg-card border-none shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {story.questions?.category}
              </p>
              <CardTitle className="text-3xl font-serif">{displayTitle}</CardTitle>
            </div>
            {!isEditing && user?.id === story.author_id && (
              <Button variant="ghost" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Story
              </Button>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDistanceToNow(new Date(story.created_at), { addSuffix: true })}
          </div>
          {story.questions?.question && (
            <>
              <Separator className="my-4" />
              <p className="text-muted-foreground italic">
                Inspired by: {story.questions.question}
              </p>
            </>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <StoryForm
              title={story.title}
              content={story.content}
              isSubmitting={false}
              draftId={story.id}
              remainingStories={1}
              onTitleChange={(title) => story.title = title}
              onContentChange={(content) => story.content = content}
              onSubmit={handleUpdateStory}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {story.content.split('\n\n').map((paragraph, index) => (
                paragraph ? (
                  <p key={index} className="mb-6 leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ) : null
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
