import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calculator, AlertTriangle } from "lucide-react";
import { Product, Sale } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface AddSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  products: Product[];
}

export const AddSaleDialog = ({ open, onOpenChange, onAddSale, products }: AddSaleDialogProps) => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const selectedProductData = products.find(p => p.id === selectedProduct);
  const totalAmount = quantity && price ? (parseFloat(price) * parseInt(quantity)).toFixed(2) : "0.00";
  const availableStock = selectedProductData?.quantity || 0;
  const requestedQuantity = parseInt(quantity) || 0;
  const insufficientStock = requestedQuantity > availableStock;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !quantity || !price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (insufficientStock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${availableStock} units available for ${selectedProductData?.name}.`,
        variant: "destructive"
      });
      return;
    }

    if (selectedProductData) {
      onAddSale({
        productName: selectedProductData.name,
        price: parseFloat(price),
        companyName: selectedProductData.company,
        quantity: parseInt(quantity)
      });

      toast({
        title: "Sale Recorded",
        description: `Sale of ${quantity} ${selectedProductData.name} recorded successfully.`,
      });

      setSelectedProduct("");
      setQuantity("");
      setPrice("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Record New Sale
          </DialogTitle>
          <DialogDescription>
            Enter sale details and automatically update inventory.
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Sale Information
            </CardTitle>
            <CardDescription>All fields are required for sale recording</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product Name *</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product to sell" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - {product.company} (Stock: {product.quantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProductData && (
                <div className="p-3 bg-accent rounded-lg">
                  <div className="text-sm space-y-1">
                    <p><strong>Company:</strong> {selectedProductData.company}</p>
                    <p><strong>Formula:</strong> {selectedProductData.formula}</p>
                    <p><strong>Available Stock:</strong> {selectedProductData.quantity} units</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    required
                  />
                  {insufficientStock && quantity && (
                    <div className="flex items-center gap-1 text-sm text-destructive">
                      <AlertTriangle className="h-3 w-3" />
                      Insufficient stock ({availableStock} available)
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sale-price">Price per Unit *</Label>
                  <Input
                    id="sale-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter sale price"
                    required
                  />
                </div>
              </div>

              {quantity && price && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Sale Amount:</span>
                    <span className="text-2xl font-bold text-primary">${totalAmount}</span>
                  </div>
                  {selectedProductData && (
                    <div className="text-sm text-muted-foreground mt-2">
                      Remaining stock after sale: {Math.max(0, availableStock - requestedQuantity)} units
                    </div>
                  )}
                </div>
              )}

              <Button 
                type="submit" 
                className="inventory-button-primary w-full"
                disabled={insufficientStock}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Record Sale
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};