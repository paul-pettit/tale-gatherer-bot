
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface PreviewDialogProps {
  isOpen: boolean
  onClose: () => void
  previewContent: string
  title: string
  onSave: (title: string, content: string) => void
  onDelete: () => void
}

export function PreviewDialog({
  isOpen,
  onClose,
  previewContent,
  title,
  onSave,
  onDelete
}: PreviewDialogProps) {
  const [editedContent, setEditedContent] = useState(previewContent)
  const [editedTitle, setEditedTitle] = useState(title)

  const handleSave = () => {
    onSave(editedTitle, editedContent)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Preview Your Story</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 flex-1 overflow-auto">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Enter story title"
            className="w-full"
          />
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Your story content"
            className="min-h-[400px]"
          />
        </div>
        <DialogFooter className="space-x-2">
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save to Library
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
