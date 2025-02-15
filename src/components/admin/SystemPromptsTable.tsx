
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SystemPrompt {
  id: string;
  type: 'interview' | 'story_generation';
  content: string;
  created_at: string;
  updated_at: string;
}

interface SystemPromptsTableProps {
  prompts: SystemPrompt[];
}

export function SystemPromptsTable({ prompts }: SystemPromptsTableProps) {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleEdit = (prompt: SystemPrompt) => {
    setEditingId(prompt.id);
    setEditContent(prompt.content);
  };

  const handleSave = async (promptId: string) => {
    try {
      const { error } = await supabase
        .from('system_prompts')
        .update({ content: editContent })
        .eq('id', promptId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "System prompt updated successfully",
      });
      
      setEditingId(null);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating prompt:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update system prompt",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditContent("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Prompts</CardTitle>
        <CardDescription>
          Manage AI system prompts used throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead className="w-[60%]">Content</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prompts.map((prompt) => (
              <TableRow key={prompt.id}>
                <TableCell className="font-medium">
                  {prompt.type.replace('_', ' ')}
                </TableCell>
                <TableCell>
                  {editingId === prompt.id ? (
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[200px]"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap">{prompt.content}</pre>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(prompt.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {editingId === prompt.id ? (
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleSave(prompt.id)}
                        className="w-full"
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(prompt)}
                      className="w-full"
                    >
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
