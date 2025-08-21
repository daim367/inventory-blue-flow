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
import { CalendarIcon, Plus, RotateCcw, X, Search, History, Package } from "lucide-react";
import { StockEntry } from "@/pages/Index";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface StockEntriesProps {
  entries: StockEntry[];
}

export const StockEntries = ({ entries }: StockEntriesProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter entries by search term and date
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchTerm || 
      entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.formula.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !selectedDate || (() => {
      const entryDate = new Date(entry.date);
      const filterDate = new Date(selectedDate);
      return entryDate.toDateString() === filterDate.toDateString();
    })();
    
    return matchesSearch && matchesDate;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => b.date.getTime() - a.date.getTime());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEntryTypeVariant = (type: 'new' | 'existing') => {
    return type === 'new' ? 'default' : 'secondary';
  };

  const getEntryTypeIcon = (type: 'new' | 'existing') => {
    return type === 'new' ? Package : Plus;
  };

  const clearDateFilter = () => {
    setSelectedDate(undefined);
  };

  const clearSearchFilter = () => {
    setSearchTerm("");
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No Stock Entries</h3>
        <p className="text-sm text-muted-foreground">Stock entry history will appear here when you add products.</p>
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
            placeholder="Search by product name, company, or formula..."
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
        
        {/* Date Filter */}
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
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-accent rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
              <p className="text-2xl font-bold text-primary">{filteredEntries.length}</p>
            </div>
            <History className="h-8 w-8 text-accent-foreground" />
          </div>
        </div>
        
        <div className="p-4 bg-accent rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">New Products</p>
               <p className="text-2xl font-bold text-primary">
                {filteredEntries.filter(e => e.type === 'new').length}
               </p>
            </div>
            <Package className="h-8 w-8 text-accent-foreground" />
          </div>
        </div>
        
        <div className="p-4 bg-accent rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Stock Updates</p>
               <p className="text-2xl font-bold text-primary">
                {filteredEntries.filter(e => e.type === 'existing').length}
               </p>
            </div>
            <Plus className="h-8 w-8 text-accent-foreground" />
          </div>
        </div>
      </div>

      {/* Entries Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Formula</TableHead>
              <TableHead className="text-right">Quantity Change</TableHead>
              <TableHead>Entry Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntries.map((entry) => {
              const EntryIcon = getEntryTypeIcon(entry.type);
              return (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono text-sm">
                    {formatDate(entry.date)}
                  </TableCell>
                  <TableCell className="font-medium">{entry.productName}</TableCell>
                  <TableCell>{entry.company}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{entry.formula}</TableCell>
                  <TableCell className="text-right font-mono">
                    +{entry.quantityChange}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getEntryTypeVariant(entry.type)} className="flex items-center gap-1 w-fit">
                      <EntryIcon className="h-3 w-3" />
                      {entry.type === 'new' ? 'New Product' : 'Stock Update'}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};