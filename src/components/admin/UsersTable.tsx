
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

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  subscription_plan: string | null;
  created_at: string;
}

interface UsersTableProps {
  profiles: Profile[];
}

export function UsersTable({ profiles }: UsersTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Overview of all registered users</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.full_name || 'N/A'}</TableCell>
                <TableCell>{profile.email}</TableCell>
                <TableCell>{profile.subscription_plan || 'Free'}</TableCell>
                <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
