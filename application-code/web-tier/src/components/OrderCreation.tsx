import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Plus, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';
interface OrderItem {
  id: string;
  product_id: number;
  product_name: string;
  quantity: number;
}

export default function OrderCreation() {
  const [orderType, setOrderType] = useState<'IN' | 'OUT'>('IN');
  const [warehouseId, setWarehouseId] = useState<string>('');
  const [reference, setReference] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  useEffect(() => {
  const loadData = async () => {
      const p = await api.getProducts();
      setProducts(p);
      const w = await api.getWarehouses();
      setWarehouses(w);
  };
  loadData();
}, []);

  const addOrderItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      product_id: 0,
      product_name: '',
      quantity: 0,
    };
    setOrderItems([...orderItems, newItem]);
  };

  const updateOrderItem = (id: string, field: keyof OrderItem, value: any) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        if (field === 'product_id') {
          const product = products.find(p => p.id === parseInt(value));
          return { ...item, product_id: parseInt(value), product_name: product?.name || '' };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const removeOrderItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!warehouseId) {
      toast.error('Please select a warehouse');
      return;
    }

    if (orderItems.length === 0) {
      toast.error('Please add at least one order item');
      return;
    }

    if (orderItems.some(item => !item.product_id || item.quantity <= 0)) {
      toast.error('Please fill in all order items with valid quantities');
      return;
    }

    const orderNumber = `${orderType}-${Date.now()}`;
    const order = {
      order_number: orderNumber,
      type: orderType,
      warehouse_id: parseInt(warehouseId),
      reference,
      items: orderItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
      created_by: 1, // Hardcoded for demo
    };

    await api.createOrder(order);
    toast.success(`Order ${orderNumber} created successfully!`);

    // Reset form
    setOrderType('IN');
    setWarehouseId('');
    setReference('');
    setOrderItems([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Create Order</h1>
        <p className="text-gray-500">Create inbound or outbound warehouse orders</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
            <CardDescription>Basic order details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order-type">Order Type</Label>
                <Select value={orderType} onValueChange={(value: 'IN' | 'OUT') => setOrderType(value)}>
                  <SelectTrigger id="order-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">IN - Inbound (Receiving)</SelectItem>
                    <SelectItem value="OUT">OUT - Outbound (Shipping)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouse">Warehouse</Label>
                <Select value={warehouseId} onValueChange={setWarehouseId}>
                  <SelectTrigger id="warehouse">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w.id} value={w.id.toString()}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference / Notes</Label>
              <Textarea
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Optional reference or notes"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>Add products and quantities</CardDescription>
              </div>
              <Button type="button" onClick={addOrderItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {orderItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No items added yet. Click "Add Item" to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Product</TableHead>
                    <TableHead className="w-[30%]">Quantity</TableHead>
                    <TableHead className="w-[20%] text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Select
                          value={item.product_id.toString()}
                          onValueChange={(value : any) => updateOrderItem(item.id, 'product_id', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p.id} value={p.id.toString()}>
                                {p.sku} - {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity || ''}
                          onChange={(e) => updateOrderItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          placeholder="Qty"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOrderItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOrderType('IN');
              setWarehouseId('');
              setReference('');
              setOrderItems([]);
            }}
          >
            Reset
          </Button>
          <Button type="submit">
            <Check className="h-4 w-4 mr-2" />
            Submit Order
          </Button>
        </div>
      </form>
    </div>
  );
}
