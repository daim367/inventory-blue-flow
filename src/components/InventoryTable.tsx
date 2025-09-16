import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertTriangle, Package, CalendarIcon, X, Search, Trash2 } from "lucide-react";
import { LegacyProduct } from "@/pages/Index";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useDeleteProduct } from "@/hooks/useInventoryData";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface InventoryTableProps {
  products: LegacyProduct[];
}

export const InventoryTable = ({ products }: InventoryTableProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const deleteProduct = useDeleteProduct();

  const handleDeleteProduct = (productId: string) => {
    deleteProduct.mutate(productId);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { label: "Out of Stock", variant: "destructive" as const, icon: AlertTriangle };
    } else if (quantity < 10) {
      return { label: "Low Stock", variant: "secondary" as const, icon: AlertTriangle };
    } else {
      return { label: "In Stock", variant: "default" as const, icon: Package };
    }
  };

  // Filter products by search term and date
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !selectedDate || (() => {
      const productDate = new Date(product.dateAdded);
      const filterDate = new Date(selectedDate);
      return productDate.toDateString() === filterDate.toDateString();
    })();
    
    return matchesSearch && matchesDate;
  });

  const clearDateFilter = () => {
    setSelectedDate(undefined);
  };

  const clearSearchFilter = () => {
    setSearchTerm("");
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
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name, formula, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearchFilter}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Filter by date added"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {selectedDate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearDateFilter}
              className="h-9 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
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
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{product.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};