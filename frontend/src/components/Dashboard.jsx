import React, { useEffect, useState } from "react";
import { ingredientService, analyticsService, orderService } from '../services/api';
import Sidebar from './Sidebar';
import { ShoppingBag, CreditCard, TrendingUp, User } from 'lucide-react';

const Dashboard = () => {

  const [lowStockIngredients, setLowStockIngredients] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [period, setPeriod] = useState('Today');

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await ingredientService.getAllIngredients();
        // Low stock: currentQuantity <= thresholdQuantity
        const lowStock = data.filter(i => i.currentQuantity <= i.thresholdQuantity);
        setLowStockIngredients(lowStock);
      } catch (err) {
        setLowStockIngredients([]);
      }
    };
    const fetchBestSellers = async () => {
      try {
        const data = await analyticsService.getBestSellers(5);
        setBestSellers(data);
      } catch (err) {
        setBestSellers([]);
      }
    };
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAllOrders ? await orderService.getAllOrders() : [];
        setOrders(data);
      } catch (err) {
        setOrders([]);
      }
    };
    fetchIngredients();
    fetchBestSellers();
    fetchOrders();
  }, []);

  // Calculate period boundaries
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Helper to parse order time
  const parseOrderTime = o => o.orderTime ? new Date(o.orderTime) : null;

  // Orders for each period
  const ordersToday = orders.filter(o => {
    const t = parseOrderTime(o);
    return t && t >= todayStart;
  });
  const ordersThisWeek = orders.filter(o => {
    const t = parseOrderTime(o);
    return t && t >= weekStart;
  });
  const ordersThisMonth = orders.filter(o => {
    const t = parseOrderTime(o);
    return t && t >= monthStart;
  });

  // Show orders for selected period
  let periodOrders = orders;
  if (period === 'Today') periodOrders = ordersToday;
  else if (period === 'This Week') periodOrders = ordersThisWeek;
  else if (period === 'This Month') periodOrders = ordersThisMonth;

  // Calculate real Avg Order Value and Active Customers for selected period
  const totalOrderValue = periodOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const avgOrderValue = periodOrders.length > 0 ? Math.round(totalOrderValue / periodOrders.length) : 0;
  const uniqueCustomers = Array.from(new Set(periodOrders.map(o => o.customerName || o.userId || '')));
  const activeCustomers = uniqueCustomers.length;
  // New customers for selected period
  let newCustomersLabel = '';
  let newCustomersCount = 0;
  if (period === 'Today') {
    newCustomersLabel = 'new today';
    newCustomersCount = Array.from(new Set(
      orders.filter(o => {
        if (!o.orderTime) return false;
        const t = parseOrderTime(o);
        return t && t >= todayStart;
      }).map(o => o.customerName || o.userId || '')
    )).length;
  } else if (period === 'This Week') {
    newCustomersLabel = 'new this week';
    newCustomersCount = Array.from(new Set(
      orders.filter(o => {
        if (!o.orderTime) return false;
        const t = parseOrderTime(o);
        return t && t >= weekStart;
      }).map(o => o.customerName || o.userId || '')
    )).length;
  } else if (period === 'This Month') {
    newCustomersLabel = 'new this month';
    newCustomersCount = Array.from(new Set(
      orders.filter(o => {
        if (!o.orderTime) return false;
        const t = parseOrderTime(o);
        return t && t >= monthStart;
      }).map(o => o.customerName || o.userId || '')
    )).length;
  }

  return (
    <div className="flex min-h-screen bg-[#f9f7f4]">
      <Sidebar activeTab="dashboard" />
      <main className="flex-1 px-10 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#23190f]">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-2 bg-white rounded-xl shadow px-2 py-1">
            {['Today', 'This Week', 'This Month'].map(p => (
              <button
                key={p}
                className={
                  (period === p ? 'bg-orange-500 text-white font-semibold' : 'text-gray-600') +
                  ' px-4 py-1 rounded-lg'
                }
                onClick={() => setPeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-red-600 font-bold">⚠ Low Stock Alert</span>
            {lowStockIngredients.length === 0 ? (
              <span className="bg-white rounded-full px-3 py-1 text-sm text-gray-700">No low stock items</span>
            ) : (
              lowStockIngredients.map(ing => (
                <span key={ing.ingredientId} className="bg-white rounded-full px-3 py-1 text-sm text-gray-700">
                  {ing.name}: {ing.currentQuantity}{ing.unit ? ing.unit : ''}
                </span>
              ))
            )}
          </div>
          <span className="text-xs text-red-400">{lowStockIngredients.length} item{lowStockIngredients.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Summary Cards */}
        <div className="flex gap-6 mb-8">
          <div className="bg-orange-500 text-white rounded-xl flex-1 p-6 shadow relative overflow-hidden">
            <div className="text-lg font-semibold mb-2">Orders {period}</div>
            <div className="text-3xl font-bold mb-1">{periodOrders.length}</div>
            <div className="text-sm">&nbsp;</div>
            <span className="absolute top-6 right-6 bg-orange-100 rounded-xl p-2">
              <ShoppingBag className="w-7 h-7 text-orange-600" />
            </span>
          </div>
          <div className="bg-green-500 text-white rounded-xl flex-1 p-6 shadow relative overflow-hidden">
            <div className="text-lg font-semibold mb-2">Revenue {period}</div>
            <div className="text-3xl font-bold mb-1">
              ₹{
                periodOrders
                  .filter(o => o.status && (o.status.toLowerCase() === 'delivered' || o.status.toLowerCase() === 'done'))
                  .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
              }
            </div>
            <div className="text-sm">&nbsp;</div>
            <span className="absolute top-6 right-6 bg-green-100 rounded-xl p-2">
              <CreditCard className="w-7 h-7 text-green-600" />
            </span>
          </div>
          <div className="bg-white rounded-xl flex-1 p-6 shadow relative overflow-hidden">
            <div className="text-lg font-semibold mb-2">Avg Order Value</div>
            <div className="text-3xl font-bold mb-1">₹{avgOrderValue}</div>
            <div className="text-sm text-gray-600">{periodOrders.length > 0 ? '' : 'No orders yet'}</div>
            <span className="absolute top-6 right-6 bg-orange-100 rounded-xl p-2">
              <TrendingUp className="w-7 h-7 text-orange-600" />
            </span>
          </div>
          <div className="bg-white rounded-xl flex-1 p-6 shadow relative overflow-hidden">
            <div className="text-lg font-semibold mb-2">Active Customers</div>
            <div className="text-3xl font-bold mb-1 text-[#23190f]">{activeCustomers}</div>
            <div className="text-sm text-gray-600">{newCustomersCount} {newCustomersLabel}</div>
            <span className="absolute top-6 right-6 bg-orange-100 rounded-xl p-2">
              <User className="w-7 h-7 text-orange-600" />
            </span>
          </div>
        </div>

        {/* Orders & Best Sellers */}
        <div className="flex gap-8">
          {/* Orders */}
          <div className="flex-1">
            <div className="font-bold text-xl mb-4">Orders</div>
            <div className="flex gap-2 mb-4">
              {['All', 'Pending', 'Done', 'Cancel'].map(f => (
                <button
                  key={f}
                  className={
                    (orderFilter === f
                      ? 'bg-orange-500 text-white font-semibold'
                      : 'bg-white text-gray-600') +
                    ' px-4 py-1 rounded-lg'
                  }
                  onClick={() => setOrderFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <input
              className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-200"
              placeholder="Search by customer name or order ID..."
              value={orderSearch}
              onChange={e => setOrderSearch(e.target.value)}
            />
            {(() => {
              let filtered = periodOrders;
              if (orderFilter === 'Pending') {
                filtered = filtered.filter(o => o.status && (o.status.toLowerCase() === 'order placed' || o.status.toLowerCase() === 'pending'));
              } else if (orderFilter === 'Done') {
                filtered = filtered.filter(o => o.status && (o.status.toLowerCase() === 'delivered' || o.status.toLowerCase() === 'done'));
              } else if (orderFilter === 'Cancel') {
                filtered = filtered.filter(o => o.status && o.status.toLowerCase().includes('cancel'));
              }
              if (orderSearch.trim() !== '') {
                const q = orderSearch.trim().toLowerCase();
                filtered = filtered.filter(o =>
                  (o.customerName && o.customerName.toLowerCase().includes(q)) ||
                  (o.id && o.id.toString().includes(q))
                );
              }
              if (filtered.length === 0) {
                return <div className="bg-white rounded-xl p-4 mb-3 flex justify-between items-center shadow text-gray-500">No orders found</div>;
              }
              return filtered.map(order => (
                <div key={order.id} className="bg-white rounded-xl p-4 mb-3 flex justify-between items-center shadow">
                  <div>
                    <div className="font-semibold">
                      {order.customerName || 'Customer'}{' '}
                      <span className={`bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full ml-2`}>{order.status}</span>
                    </div>
                    <div className="text-sm text-gray-500">Order #{order.id} • {order.orderItems ? order.orderItems.length : 0} items</div>
                  </div>
                  <div className="font-bold text-lg">₹{order.totalAmount}</div>
                </div>
              ));
            })()}
          </div>
          {/* Best Sellers */}
          <div className="w-96">
            <button className="bg-orange-500 text-white w-full py-3 rounded-lg font-semibold mb-6">+ Add Item</button>
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="font-bold text-lg mb-4">Weekly Best Sellers</div>
              {bestSellers.length === 0 ? (
                <div className="text-gray-500">No data available</div>
              ) : (
                bestSellers.map((item, idx) => (
                  <div className={idx !== bestSellers.length - 1 ? "mb-3" : ""} key={item.productName}>
                    <div className="flex justify-between items-center">
                      <div>{idx + 1}. {item.productName}</div>
                      <div className="font-bold text-orange-600">{item.totalSold} sold</div>
                    </div>
                    <div className="text-xs text-gray-500">₹{item.totalRevenue?.toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;