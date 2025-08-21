import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StockEntries } from "@/components/StockEntries";
import { useNavigate } from "react-router-dom";
import { StockEntry } from "./Index";

const StockEntriesPage = () => {
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEntries = localStorage.getItem('inventory-stock-entries');
    if (savedEntries) {
      setStockEntries(JSON.parse(savedEntries).map((e: any) => ({
        ...e,
        date: new Date(e.date)
      })));
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
            <StockEntries entries={stockEntries} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StockEntriesPage;