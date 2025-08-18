import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from "lucide-react";
import { Product } from "@/pages/Index";

interface InventoryTableProps {
  products: Product[];
}

export const InventoryTable = ({ products }: InventoryTableProps) => {
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { label: "Out of Stock", variant: "destructive" as const, icon: AlertTriangle };
    } else if (quantity < 10) {
      return { label: "Low Stock", variant: "secondary" as const, icon: AlertTriangle };
    } else {
      return { label: "In Stock", variant: "default" as const, icon: Package };
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No Products Found</h3>
        <p className="text-sm text-muted-foreground">Add your first product to get started with inventory management.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Formula</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Price/Unit</TableHead>
            <TableHead className="text-right">Total Value</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const status = getStockStatus(product.quantity);
            const StatusIcon = status.icon;
            const totalValue = (product.price || 0) * product.quantity;
            
            return (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.company}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{product.formula}</TableCell>
                <TableCell className="text-right font-mono">{product.quantity}</TableCell>
                <TableCell className="text-right font-mono">
                  {product.price ? `PKR ${product.price.toFixed(2)}` : '-'}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {product.price ? `PKR ${totalValue.toFixed(2)}` : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};