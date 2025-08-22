import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { CalendarIcon, TrendingUp, Download, X, Search } from "lucide-react";
import { LegacySale } from "@/pages/Index";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SalesHistoryProps {
  sales: LegacySale[];
}

export const SalesHistory = ({ sales }: SalesHistoryProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");

  const exportToCSV = () => {
    const csvData = sales.map(sale => ({
      'Product Name': sale.productName,
      'Company': sale.companyName,
      'Price (PKR)': sale.price.toFixed(2),
      'Units Sold': sale.quantity,
      'Date': formatDate(sale.date)
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales-history-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter sales by search term and date
  const filteredSales = sales.filter(sale => {
    const matchesSearch = !searchTerm || 
      sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !selectedDate || (() => {
      const saleDate = new Date(sale.date);
      const filterDate = new Date(selectedDate);
      return saleDate.toDateString() === filterDate.toDateString();
    })();
    
    return matchesSearch && matchesDate;
  });

  const sortedSales = [...filteredSales].sort((a, b) => b.date.getTime() - a.date.getTime());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSaleAmount = (sale: LegacySale) => {
    return (sale.price * sale.quantity).toFixed(2);
  };

  const clearDateFilter = () => {
    setSelectedDate(undefined);
  };

  const clearSearchFilter = () => {
    setSearchTerm("");
  };

  if (sales.length === 0) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No Sales Recorded</h3>
        <p className="text-sm text-muted-foreground">Start recording sales to track your business performance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearchFilter}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Date Filter and Export */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {selectedDate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearDateFilter}
              className="h-9 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="flex items-center gap-2"
            disabled={sales.length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-accent rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
               <p className="text-2xl font-bold text-primary">
                PKR {filteredSales.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0).toFixed(2)}
               </p>
            </div>
            <TrendingUp className="h-8 w-8 text-accent-foreground" />
          </div>
        </div>
        
        <div className="p-4 bg-accent rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold text-primary">{filteredSales.length}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-accent-foreground" />
          </div>
        </div>
        
        <div className="p-4 bg-accent rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Sale Value</p>
               <p className="text-2xl font-bold text-primary">
                PKR {filteredSales.length > 0 
                  ? (filteredSales.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0) / filteredSales.length).toFixed(2)
                  : '0.00'
                }
               </p>
            </div>
            <TrendingUp className="h-8 w-8 text-accent-foreground" />
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price/Unit</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-mono text-sm">
                  {formatDate(sale.date)}
                </TableCell>
                <TableCell className="font-medium">{sale.productName}</TableCell>
                <TableCell>{sale.companyName}</TableCell>
                <TableCell className="text-right font-mono">{sale.quantity}</TableCell>
                <TableCell className="text-right font-mono">PKR {sale.price.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono font-semibold text-primary">
                  PKR {getSaleAmount(sale)}
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="inventory-success">
                    Completed
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};