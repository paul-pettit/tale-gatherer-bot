
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function PurchaseHistory() {
  const { data: purchases, isLoading } = useQuery({
    queryKey: ['credit-purchases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credit_purchases')
        .select(`
          *,
          credit_packages (
            name,
            credits
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            Loading purchase history...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase History</CardTitle>
        <CardDescription>Your credit purchase history</CardDescription>
      </CardHeader>
      <CardContent>
        {purchases && purchases.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Package</TableHead>
                <TableHead className="text-right">Credits</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>
                    {format(new Date(purchase.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{purchase.credit_packages?.name}</TableCell>
                  <TableCell className="text-right">
                    {purchase.credits_granted}
                  </TableCell>
                  <TableCell className="text-right">
                    ${purchase.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'}>
                      {purchase.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No purchase history found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
