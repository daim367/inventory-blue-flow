import { useState, useEffect } from "react";
import { Plus, Package, TrendingUp, ClipboardList, BarChart3, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddProductDialog } from "@/components/AddProductDialog";
import { AddSaleDialog } from "@/components/AddSaleDialog";
import { InventoryTable } from "@/components/InventoryTable";
import { SalesHistory } from "@/components/SalesHistory";
import { StockEntries } from "@/components/StockEntries";
import { InstallButton } from "@/components/InstallButton";

export interface Product {
  id: string;
  name: string;
  company: string;
  formula: string;
  quantity: number;
  price?: number;
  dateAdded: Date;
}

export interface Sale {
  id: string;
  productName: string;
  price: number;
  companyName: string;
  quantity: number;
  date: Date;
}

export interface StockEntry {
  id: string;
  productName: string;
  company: string;
  formula: string;
  quantityChange: number;
  type: 'new' | 'existing';
  date: Date;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddSale, setShowAddSale] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showSalesHistory, setShowSalesHistory] = useState(false);
  const [showStockEntries, setShowStockEntries] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('inventory-products');
    const savedSales = localStorage.getItem('inventory-sales');
    const savedEntries = localStorage.getItem('inventory-stock-entries');
    
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);
      // Handle legacy products without dateAdded
      const productsWithDates = parsedProducts.map((product: any) => ({
        ...product,
        dateAdded: product.dateAdded ? new Date(product.dateAdded) : new Date()
      }));
      setProducts(productsWithDates);
    }
    if (savedSales) {
      setSales(JSON.parse(savedSales).map((sale: any) => ({
        ...sale,
        date: new Date(sale.date)
      })));
    }
    if (savedEntries) {
      setStockEntries(JSON.parse(savedEntries).map((e: any) => ({
        ...e,
        date: new Date(e.date)
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

  useEffect(() => {
    localStorage.setItem('inventory-stock-entries', JSON.stringify(stockEntries));
  }, [stockEntries]);

  const handleAddProduct = (product: Omit<Product, 'id' | 'dateAdded'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      dateAdded: new Date()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const handleIncreaseProduct = (productId: string, addQuantity: number, date: Date) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, quantity: p.quantity + addQuantity } : p));
    const p = products.find(p => p.id === productId);
    if (p) {
      const newEntry: StockEntry = {
        id: Date.now().toString(),
        productName: p.name,
        company: p.company,
        formula: p.formula,
        quantityChange: addQuantity,
        type: 'existing',
        date
      };
      setStockEntries(prev => [...prev, newEntry]);
    }
  };

  const handleLogStockEntry = (entry: Omit<StockEntry, 'id'>) => {
    const newEntry: StockEntry = { ...entry, id: Date.now().toString() };
    setStockEntries(prev => [...prev, newEntry]);
  };

  const handleAddSale = (saleData: Omit<Sale, 'id'> & { date?: Date }) => {
    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      date: saleData.date || new Date()
    };
    
    // Update inventory - deduct sold quantity
    setProducts(prev => 
      prev.map(product => 
        product.name === saleData.productName 
          ? { ...product, quantity: Math.max(0, product.quantity - saleData.quantity) }
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
            <div className="flex items-center space-x-3">
              <InstallButton />
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
              <div className="text-2xl font-bold text-primary">PKR {totalSales.toFixed(2)}</div>
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
              <div className="text-2xl font-bold text-primary">PKR {totalInventoryValue.toFixed(2)}</div>
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

          <Button 
            onClick={() => setShowStockEntries(!showStockEntries)}
            variant="secondary" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            <History className="h-6 w-6" />
            <span>Stock Entry Log</span>
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

        {showStockEntries && (
          <Card className="inventory-card mb-8">
            <CardHeader>
              <CardTitle>Stock Entry Log</CardTitle>
              <CardDescription>See when products were added as new or existing</CardDescription>
            </CardHeader>
            <CardContent>
              <StockEntries entries={stockEntries} />
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
        onIncreaseProduct={handleIncreaseProduct}
        onLogStockEntry={handleLogStockEntry}
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