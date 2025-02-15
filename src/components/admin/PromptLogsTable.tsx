
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

interface PromptLog {
  id: string;
  created_at: string;
  story_id: string;
  user_id: string;
  prompt: string;
  model: 'gpt-4o-mini' | 'gpt-4o';
  tokens_used: number;
  cost_usd: number;
  status: string;
}

interface PromptLogsTableProps {
  logs: PromptLog[];
}

export function PromptLogsTable({ logs }: PromptLogsTableProps) {
  const totalCost = logs.reduce((sum, log) => sum + log.cost_usd, 0);
  const totalTokens = logs.reduce((sum, log) => sum + log.tokens_used, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Prompt Logs</CardTitle>
        <CardDescription>
          Total tokens used: {totalTokens.toLocaleString()} | 
          Total cost: ${totalCost.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Tokens</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                <TableCell>{log.user_id}</TableCell>
                <TableCell>{log.model}</TableCell>
                <TableCell>{log.tokens_used.toLocaleString()}</TableCell>
                <TableCell>${log.cost_usd.toFixed(4)}</TableCell>
                <TableCell>{log.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
