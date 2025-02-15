
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function CreateFamilyDialog() {
  const [open, setOpen] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleCreateFamily = async () => {
    if (!familyName.trim()) {
      toast.error("Please enter a family name");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('families')
        .insert([{ name: familyName.trim() }]);

      if (error) throw error;

      toast.success("Family created successfully!");
      queryClient.invalidateQueries({ queryKey: ['families'] });
      setOpen(false);
      setFamilyName("");
    } catch (error) {
      toast.error("Failed to create family");
      console.error("Error creating family:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Family</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Family</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Family Name</Label>
            <Input
              id="name"
              placeholder="Enter family name"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleCreateFamily}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Family"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
