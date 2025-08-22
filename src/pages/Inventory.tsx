import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryTable } from "@/components/InventoryTable";
import { useNavigate } from "react-router-dom";
import { useProducts, type Product } from "@/hooks/useInventoryData";
import { LegacyProduct } from "./Index";

const Inventory = () => {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts();

  // Convert to legacy format for existing components
  const legacyProducts: LegacyProduct[] = products.map(p => ({
    id: p.id,
    name: p.name,
    company: p.company || '',
    formula: p.formula || '',
    quantity: p.quantity,
    price: p.price,
    dateAdded: new Date(p.created_at)
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="inventory-header">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Current Inventory</h1>
              <p className="text-white/80 mt-1">View and manage your product inventory</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card className="inventory-card">
          <CardHeader>
            <CardTitle>Current Inventory</CardTitle>
            <CardDescription>View and manage your product inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryTable products={legacyProducts} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Inventory;