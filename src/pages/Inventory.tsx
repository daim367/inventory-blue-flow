import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryTable } from "@/components/InventoryTable";
import { useNavigate } from "react-router-dom";
import { Product } from "./Index";

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedProducts = localStorage.getItem('inventory-products');
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);
      const productsWithDates = parsedProducts.map((product: any) => ({
        ...product,
        dateAdded: product.dateAdded ? new Date(product.dateAdded) : new Date()
      }));
      setProducts(productsWithDates);
    }
  }, []);

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
            <InventoryTable products={products} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Inventory;