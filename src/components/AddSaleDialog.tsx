import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TrendingUp, Calculator, AlertTriangle, Check, ChevronsUpDown } from "lucide-react";
import { LegacyProduct, LegacySale } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AddSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSale: (sale: Omit<LegacySale, 'id'> & { date?: Date }) => void;
  products: LegacyProduct[];
}

export const AddSaleDialog = ({ open, onOpenChange, onAddSale, products }: AddSaleDialogProps) => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [saleDate, setSaleDate] = useState<Date>(new Date());
  const [openProductSelect, setOpenProductSelect] = useState(false);

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
        quantity: parseInt(quantity),
        customerName: customerName,
        phoneNumber: phoneNumber,
        date: saleDate
      });

      toast({
        title: "Sale Recorded",
        description: `Sale of ${quantity} ${selectedProductData.name} recorded successfully.`,
      });

      setSelectedProduct("");
      setQuantity("");
      setPrice("");
      setCustomerName("");
      setPhoneNumber("");
      setSaleDate(new Date());
      setOpenProductSelect(false);
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
                <Popover open={openProductSelect} onOpenChange={setOpenProductSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProductSelect}
                      className="w-full justify-between"
                    >
                      {selectedProduct
                        ? products.find((product) => product.id === selectedProduct)?.name
                        : "Select product..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search products..." />
                      <CommandList>
                        <CommandEmpty>No product found.</CommandEmpty>
                        <CommandGroup>
                          {products.map((product) => (
                            <CommandItem
                              key={product.id}
                              value={`${product.name} ${product.company} ${product.formula}`}
                              onSelect={() => {
                                setSelectedProduct(product.id);
                                setOpenProductSelect(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedProduct === product.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{product.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  {product.company} • {product.formula} • Stock: {product.quantity}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input
                    id="customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    id="phone-number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

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

              <div className="space-y-2">
                <Label>Sale Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !saleDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {saleDate ? format(saleDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={saleDate}
                      onSelect={(date) => setSaleDate(date || new Date())}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {quantity && price && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Sale Amount:</span>
                    <span className="text-2xl font-bold text-primary">PKR {totalAmount}</span>
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