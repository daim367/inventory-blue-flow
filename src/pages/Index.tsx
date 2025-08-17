import { useState, useEffect } from "react";
import { Plus, Package, TrendingUp, ClipboardList, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddProductDialog } from "@/components/AddProductDialog";
import { AddSaleDialog } from "@/components/AddSaleDialog";
import { InventoryTable } from "@/components/InventoryTable";
import { SalesHistory } from "@/components/SalesHistory";

export interface Product {
  id: string;
  name: string;
  company: string;
  formula: string;
  quantity: number;
  price?: number;
}

export interface Sale {
  id: string;
  productName: string;
  price: number;
  companyName: string;
  quantity: number;
  date: Date;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddSale, setShowAddSale] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showSalesHistory, setShowSalesHistory] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('inventory-products');
    const savedSales = localStorage.getItem('inventory-sales');
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    if (savedSales) {
      setSales(JSON.parse(savedSales).map((sale: any) => ({
        ...sale,
        date: new Date(sale.date)
      })));
    }
  }, []);

  // Save data to localStorage whenever products or sales change
  useEffect(() => {
    localStorage.setItem('inventory-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('inventory-sales', JSON.stringify(sales));
  }, [sales]);

  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const handleAddSale = (sale: Omit<Sale, 'id' | 'date'>) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      date: new Date()
    };
    
    // Update inventory - deduct sold quantity
    setProducts(prev => 
      prev.map(product => 
        product.name === sale.productName 
          ? { ...product, quantity: Math.max(0, product.quantity - sale.quantity) }
          : product
      )
    );
    
    setSales(prev => [...prev, newSale]);
  };

  const totalInventoryValue = products.reduce((sum, product) => sum + (product.quantity * (product.price || 0)), 0);
  const totalSales = sales.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0);
  const lowStockItems = products.filter(product => product.quantity < 10).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="inventory-header">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
              <p className="text-white/80 mt-1">Manage your products and track sales efficiently</p>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="inventory-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-accent-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                {lowStockItems > 0 && `${lowStockItems} low stock`}
              </p>
            </CardContent>
          </Card>

          <Card className="inventory-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalSales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {sales.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card className="inventory-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <BarChart3 className="h-4 w-4 text-accent-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalInventoryValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Current stock value
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            onClick={() => setShowAddProduct(true)}
            className="inventory-button-primary h-20 flex flex-col items-center justify-center space-y-2"
          >
            <Plus className="h-6 w-6" />
            <span>Add New Product</span>
          </Button>
          
          <Button 
            onClick={() => setShowAddSale(true)}
            className="inventory-button-primary h-20 flex flex-col items-center justify-center space-y-2"
          >
            <TrendingUp className="h-6 w-6" />
            <span>Add Sales</span>
          </Button>
          
          <Button 
            onClick={() => setShowInventory(!showInventory)}
            variant="secondary"
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            <ClipboardList className="h-6 w-6" />
            <span>Inventory Checkup</span>
          </Button>
          
          <Button 
            onClick={() => setShowSalesHistory(!showSalesHistory)}
            variant="secondary" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            <BarChart3 className="h-6 w-6" />
            <span>Sales History</span>
          </Button>
        </div>

        {/* Content Sections */}
        {showInventory && (
          <Card className="inventory-card mb-8">
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
              <CardDescription>View and manage your product inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <InventoryTable products={products} />
            </CardContent>
          </Card>
        )}

        {showSalesHistory && (
          <Card className="inventory-card mb-8">
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>Track your sales performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesHistory sales={sales} />
            </CardContent>
          </Card>
        )}
      </main>

      {/* Dialogs */}
      <AddProductDialog 
        open={showAddProduct}
        onOpenChange={setShowAddProduct}
        onAddProduct={handleAddProduct}
        existingProducts={products}
      />
      
      <AddSaleDialog 
        open={showAddSale}
        onOpenChange={setShowAddSale}
        onAddSale={handleAddSale}
        products={products}
      />
    </div>
  );
};

export default Index;