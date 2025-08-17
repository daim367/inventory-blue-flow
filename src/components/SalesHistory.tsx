import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar } from "lucide-react";
import { Sale } from "@/pages/Index";

interface SalesHistoryProps {
  sales: Sale[];
}

export const SalesHistory = ({ sales }: SalesHistoryProps) => {
  const sortedSales = [...sales].sort((a, b) => b.date.getTime() - a.date.getTime());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSaleAmount = (sale: Sale) => {
    return (sale.price * sale.quantity).toFixed(2);
  };

  if (sales.length === 0) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No Sales Recorded</h3>
        <p className="text-sm text-muted-foreground">Start recording sales to track your business performance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-accent rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
              <p className="text-2xl font-bold text-primary">
                ${sales.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0).toFixed(2)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-accent-foreground" />
          </div>
        </div>
        
        <div className="p-4 bg-accent rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold text-primary">{sales.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-accent-foreground" />
          </div>
        </div>
        
        <div className="p-4 bg-accent rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Sale Value</p>
              <p className="text-2xl font-bold text-primary">
                ${sales.length > 0 
                  ? (sales.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0) / sales.length).toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-accent-foreground" />
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price/Unit</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-mono text-sm">
                  {formatDate(sale.date)}
                </TableCell>
                <TableCell className="font-medium">{sale.productName}</TableCell>
                <TableCell>{sale.companyName}</TableCell>
                <TableCell className="text-right font-mono">{sale.quantity}</TableCell>
                <TableCell className="text-right font-mono">${sale.price.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono font-semibold text-primary">
                  ${getSaleAmount(sale)}
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="inventory-success">
                    Completed
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};