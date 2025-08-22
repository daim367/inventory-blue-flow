import { useState } from "react";
import { Plus, Package, TrendingUp, ClipboardList, BarChart3, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddProductDialog } from "@/components/AddProductDialog";
import { AddSaleDialog } from "@/components/AddSaleDialog";
import { InstallButton } from "@/components/InstallButton";
import { 
  useProducts, 
  useSales, 
  useStockEntries, 
  useAddProduct, 
  useAddSale, 
  useAddStockEntry,
  useUpdateProductQuantity,
  type Product,
  type Sale,
  type StockEntry
} from "@/hooks/useInventoryData";

// Legacy interfaces for compatibility
export interface LegacyProduct {
  id: string;
  name: string;
  company: string;
  formula: string;
  quantity: number;
  price?: number;
  dateAdded: Date;
}

export interface LegacySale {
  id: string;
  productName: string;
  price: number;
  companyName: string;
  quantity: number;
  date: Date;
}

export interface LegacyStockEntry {
  id: string;
  productName: string;
  company: string;
  formula: string;
  quantityChange: number;
  type: 'new' | 'existing';
  date: Date;
}

const Index = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddSale, setShowAddSale] = useState(false);
  const navigate = useNavigate();

  // Database queries
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: sales = [], isLoading: salesLoading } = useSales();
  const { data: stockEntries = [], isLoading: stockEntriesLoading } = useStockEntries();

  // Mutations
  const addProductMutation = useAddProduct();
  const addSaleMutation = useAddSale();
  const addStockEntryMutation = useAddStockEntry();
  const updateProductQuantityMutation = useUpdateProductQuantity();

  const handleAddProduct = (product: Omit<LegacyProduct, 'id' | 'dateAdded'>) => {
    addProductMutation.mutate({
      name: product.name,
      company: product.company,
      formula: product.formula,
      quantity: product.quantity,
      price: product.price || 0
    });
  };

  const handleIncreaseProduct = (productId: string, addQuantity: number, date: Date) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      // Update product quantity
      updateProductQuantityMutation.mutate({ 
        id: productId, 
        quantity: product.quantity + addQuantity 
      });
      
      // Log stock entry
      addStockEntryMutation.mutate({
        product_id: productId,
        product_name: product.name,
        company: product.company || '',
        formula: product.formula || '',
        quantity: addQuantity,
        entry_type: 'existing',
        entry_date: date.toISOString()
      });
    }
  };

  const handleLogStockEntry = (entry: Omit<LegacyStockEntry, 'id'>) => {
    addStockEntryMutation.mutate({
      product_name: entry.productName,
      company: entry.company,
      formula: entry.formula,
      quantity: entry.quantityChange,
      entry_type: entry.type,
      entry_date: entry.date.toISOString()
    });
  };

  const handleAddSale = (saleData: Omit<LegacySale, 'id'> & { date?: Date }) => {
    const product = products.find(p => p.name === saleData.productName);
    const saleDate = saleData.date || new Date();
    
    addSaleMutation.mutate({
      product_id: product?.id,
      product_name: saleData.productName,
      company: saleData.companyName,
      quantity: saleData.quantity,
      price: saleData.price,
      total: saleData.price * saleData.quantity,
      sale_date: saleDate.toISOString()
    });
  };

  const totalInventoryValue = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const lowStockItems = products.filter(product => product.quantity < 10).length;
  
  // Convert database data to legacy format for existing components
  const legacyProducts: LegacyProduct[] = products.map(p => ({
    id: p.id,
    name: p.name,
    company: p.company || '',
    formula: p.formula || '',
    quantity: p.quantity,
    price: p.price,
    dateAdded: new Date(p.created_at)
  }));

  if (productsLoading || salesLoading || stockEntriesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading inventory data...</p>
        </div>
      </div>
    );
  }

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
            onClick={() => navigate("/inventory")}
            variant="secondary"
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            <ClipboardList className="h-6 w-6" />
            <span>Inventory Checkup</span>
          </Button>
          
          <Button 
            onClick={() => navigate("/sales-history")}
            variant="secondary" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            <BarChart3 className="h-6 w-6" />
            <span>Sales History</span>
          </Button>

          <Button 
            onClick={() => navigate("/stock-entries")}
            variant="secondary" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            <History className="h-6 w-6" />
            <span>Stock Entry Log</span>
          </Button>
        </div>

      </main>

      {/* Dialogs */}
      <AddProductDialog 
        open={showAddProduct}
        onOpenChange={setShowAddProduct}
        onAddProduct={handleAddProduct}
        existingProducts={legacyProducts}
        onIncreaseProduct={handleIncreaseProduct}
        onLogStockEntry={handleLogStockEntry}
      />
      
      <AddSaleDialog 
        open={showAddSale}
        onOpenChange={setShowAddSale}
        onAddSale={handleAddSale}
        products={legacyProducts}
      />
    </div>
  );
};

export default Index;