import { useState, useEffect } from 'react';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { getInventory, getWarehouses } from '../lib/mockData';
import { Badge } from './ui/badge';
import { api } from '../lib/api';
interface InventoryItem {
  id: number;
  product_sku: string;
  product_name: string;
  warehouse_id: number;
  warehouse_name: string;
  location_code: string;
  quantity: number;
  product_price: number;
}

export default function InventoryView() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [invData, warehouseData] = await Promise.all([
          api.getInventory(),
          api.getWarehouses()
        ]);

        setInventory(invData);
        setFilteredInventory(invData);
        setWarehouses(warehouseData);
      } catch (error) {
        console.error("Failed to load inventory data", error);
      }
    };

    loadData();
  }, []);
  useEffect(() => {
    if (selectedWarehouse === 'all') {
      setFilteredInventory(inventory);
    } else {
      const filtered = inventory.filter(item => {
        return String(item.warehouse_id) === String(selectedWarehouse);
      });
      setFilteredInventory(filtered);
    }
  }, [selectedWarehouse, inventory]);

  const calculateInventoryValue = (item: InventoryItem) => {
    const price = item.product_price || 0; 
    console.log("Calculating value for item:", item, "with price:", price);
    return (item.quantity * price).toFixed(2);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (quantity < 10) return <Badge className="bg-orange-500">Low Stock</Badge>;
    return <Badge className="bg-green-500">In Stock</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Inventory View</h1>
        <p className="text-gray-500">Monitor stock levels across all warehouses</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="max-w-xs">
          <Label htmlFor="warehouse-filter">Filter by Warehouse</Label>
          <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
            <SelectTrigger id="warehouse-filter">
              <SelectValue placeholder="Select warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouses</SelectItem>
              {warehouses.map((w) => (
                <SelectItem key={w.id} value={w.id.toString()}>
                  {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Quantity on Hand</TableHead>
              <TableHead className="text-right">Inventory Value</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.product_sku}</TableCell>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.warehouse_name}</TableCell>
                <TableCell>{item.location_code}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">${calculateInventoryValue(item)}</TableCell>
                <TableCell>{getStockStatus(item.quantity)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
