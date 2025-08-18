import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History, Package, Plus } from "lucide-react";
import { StockEntry } from "@/pages/Index";

interface StockEntriesProps {
  entries: StockEntry[];
}

export const StockEntries = ({ entries }: StockEntriesProps) => {
  const sortedEntries = [...entries].sort((a, b) => b.date.getTime() - a.date.getTime());

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
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-accent rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
              <p className="text-2xl font-bold text-primary">{entries.length}</p>
            </div>
            <History className="h-8 w-8 text-accent-foreground" />
          </div>
        </div>
        
        <div className="p-4 bg-accent rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">New Products</p>
              <p className="text-2xl font-bold text-primary">
                {entries.filter(e => e.type === 'new').length}
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
                {entries.filter(e => e.type === 'existing').length}
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