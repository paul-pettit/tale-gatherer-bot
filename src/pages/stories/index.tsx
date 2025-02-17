
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { StoryCard } from "@/components/stories/StoryCard"
import { Button } from "@/components/ui/button"
import { PaginationComponent } from "@/components/ui/pagination"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const ITEMS_PER_PAGE = 12

export default function StoryLibraryPage() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['stories', user?.id, page],
    queryFn: async () => {
      const start = (page - 1) * ITEMS_PER_PAGE
      const end = start + ITEMS_PER_PAGE - 1

      const { data: stories, count } = await supabase
        .from('stories')
        .select('*, questions(question)', { count: 'exact' })
        .eq('author_id', user?.id)
        .order('created_at', { ascending: false })
        .range(start, end)

      return { stories, total: count ?? 0 }
    },
    enabled: !!user
  })

  const totalPages = Math.ceil((data?.total ?? 0) / ITEMS_PER_PAGE)

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Story Library</h1>
        <Button onClick={() => navigate('/stories/new')}>Write New Story</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {data?.stories?.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onClick={() => navigate(`/stories/${story.id}`)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}
