import { ArrowLeft, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StockEntries } from "@/components/StockEntries";
import { useNavigate } from "react-router-dom";
import { useStockEntries } from "@/hooks/useInventoryData";
import { LegacyStockEntry } from "./Index";

const StockEntriesPage = () => {
  const navigate = useNavigate();
  const { data: stockEntries = [], isLoading } = useStockEntries();

  // Convert to legacy format for existing components
  const legacyStockEntries: LegacyStockEntry[] = stockEntries.map(e => ({
    id: e.id,
    productName: e.product_name,
    company: e.company || '',
    formula: e.formula || '',
    quantityChange: e.quantity,
    type: e.entry_type as 'new' | 'existing',
    date: new Date(e.entry_date)
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <History className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading stock entries...</p>
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
              <h1 className="text-3xl font-bold text-white">Stock Entry Log</h1>
              <p className="text-white/80 mt-1">See when products were added as new or existing</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card className="inventory-card">
          <CardHeader>
            <CardTitle>Stock Entry Log</CardTitle>
            <CardDescription>See when products were added as new or existing</CardDescription>
          </CardHeader>
          <CardContent>
            <StockEntries entries={legacyStockEntries} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StockEntriesPage;