
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

interface Story {
  id: string;
  title: string;
  author_id: string;
  status: string;
  created_at: string;
}

interface StoriesTableProps {
  stories: Story[];
}

export function StoriesTable({ stories }: StoriesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stories</CardTitle>
        <CardDescription>All stories in the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories.map((story) => (
              <TableRow key={story.id}>
                <TableCell>{story.title}</TableCell>
                <TableCell>{story.author_id}</TableCell>
                <TableCell>{story.status}</TableCell>
                <TableCell>{new Date(story.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
