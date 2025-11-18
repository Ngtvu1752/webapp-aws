import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    inboundToday: 0,
    outboundToday: 0,
    lowStockItems: 0,
  });

  const [inventoryByWarehouse, setInventoryByWarehouse] = useState<any[]>([]);
  const [orderTrend, setOrderTrend] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, inventoryData, ordersData] = await Promise.all([
          api.getStats(),
          api.getInventory(),
          api.getOrders()
        ]);

        if (statsData) {
          setStats(statsData);
        }

        if (Array.isArray(inventoryData)) {
          const warehouseSummary = inventoryData.reduce((acc: any, item: any) => {
            const existing = acc.find((w: any) => w.name === item.warehouse_name);
            
            const qty = parseFloat(item.quantity);

            if (existing) {
              existing.value += qty;
            } else {
              acc.push({ 
                name: item.warehouse_name || `Warehouse ${item.warehouse_id}`, 
                value: qty 
              });
            }
            return acc;
          }, []);
          setInventoryByWarehouse(warehouseSummary);
          console.log("warehouseSummary:", warehouseSummary);
        } else {
          setInventoryByWarehouse([]);
        }

        if (Array.isArray(ordersData)) {
          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
          });

          const trendData = last7Days.map(date => {
            const inbound = ordersData.filter((o: any) => o.type === 'IN' && o.created_at && o.created_at.startsWith(date)).length;
            const outbound = ordersData.filter((o: any) => o.type === 'OUT' && o.created_at && o.created_at.startsWith(date)).length;
            return {
              date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              Inbound: inbound,
              Outbound: outbound,
            };
          });
          setOrderTrend(trendData);
        } else {
          setOrderTrend([]);
        }

      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    };

    loadDashboardData();
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8">
      <div>
        <h1>Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening with your warehouse.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Products (SKU)</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalProducts}</div>
            <p className="text-xs text-gray-500 mt-1">Active SKUs in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Inbound Orders Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.inboundToday}</div>
            <p className="text-xs text-gray-500 mt-1">Receiving operations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Outbound Orders Today</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.outboundToday}</div>
            <p className="text-xs text-gray-500 mt-1">Shipping operations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.lowStockItems}</div>
            <p className="text-xs text-gray-500 mt-1">Items below threshold</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Trends (Last 7 Days)</CardTitle>
            <CardDescription>Daily inbound and outbound operations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Inbound" fill="#10b981" />
                <Bar dataKey="Outbound" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Distribution</CardTitle>
            <CardDescription>Total units by warehouse</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryByWarehouse}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  // SỬA LỖI TS7006: Thêm kiểu (entry: any)
                  label={(entry: any) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {inventoryByWarehouse.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}