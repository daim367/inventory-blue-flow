import { ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesHistory } from "@/components/SalesHistory";
import { useNavigate } from "react-router-dom";
import { useSales } from "@/hooks/useInventoryData";
import { LegacySale } from "./Index";

const SalesHistoryPage = () => {
  const navigate = useNavigate();
  const { data: sales = [], isLoading } = useSales();

  // Convert to legacy format for existing components
  const legacySales: LegacySale[] = sales.map(s => ({
    id: s.id,
    productName: s.product_name,
    price: s.price,
    companyName: s.company || '',
    quantity: s.quantity,
    date: new Date(s.sale_date)
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading sales history...</p>
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
              <h1 className="text-3xl font-bold text-white">Sales History</h1>
              <p className="text-white/80 mt-1">Track your sales performance over time</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card className="inventory-card">
          <CardHeader>
            <CardTitle>Sales History</CardTitle>
            <CardDescription>Track your sales performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesHistory sales={legacySales} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SalesHistoryPage;