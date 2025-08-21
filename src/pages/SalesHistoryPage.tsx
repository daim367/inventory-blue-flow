import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesHistory } from "@/components/SalesHistory";
import { useNavigate } from "react-router-dom";
import { Sale } from "./Index";

const SalesHistoryPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedSales = localStorage.getItem('inventory-sales');
    if (savedSales) {
      setSales(JSON.parse(savedSales).map((sale: any) => ({
        ...sale,
        date: new Date(sale.date)
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
            <SalesHistory sales={sales} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SalesHistoryPage;