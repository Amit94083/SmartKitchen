import React, { useEffect, useState } from "react";
import { ingredientService, analyticsService, orderService, menuService } from '../services/api';
import Sidebar from './Sidebar';
import { ShoppingBag, CreditCard, TrendingUp, User, Search, X, Upload } from 'lucide-react';

const Dashboard = () => {

  const [lowStockIngredients, setLowStockIngredients] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [period, setPeriod] = useState('Today');
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isVeg: true,
    prepTimeX: '',
    packTimeY: '',
    deliveryTimeZ: '',
    imageUrl: '',
    isAvailable: true,
  });

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
    const fetchCategories = async () => {
      try {
        const menuItems = await menuService.getAllMenuItems();
        // Extract unique categories from menu items
        const uniqueCategories = [...new Set(menuItems.map(item => item.category).filter(cat => cat))];
        setCategories(uniqueCategories.sort());
      } catch (err) {
        setCategories([]);
      }
    };
    fetchIngredients();
    fetchBestSellers();
    fetchOrders();
    fetchCategories();
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

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      const ownerId = localStorage.getItem('userId') || 1; // Get owner ID from auth context
      const finalCategory = showCustomCategory ? customCategory : newMenuItem.category;
      const menuItemData = {
        ...newMenuItem,
        category: finalCategory,
        price: parseFloat(newMenuItem.price),
        prepTimeX: parseInt(newMenuItem.prepTimeX) || 0,
        packTimeY: parseInt(newMenuItem.packTimeY) || 0,
        deliveryTimeZ: parseInt(newMenuItem.deliveryTimeZ) || 0,
        createdByOwnerId: ownerId,
      };
      await menuService.createMenuItem(menuItemData);
      alert('Menu item added successfully!');
      setShowAddItemDialog(false);
      setShowCustomCategory(false);
      setCustomCategory('');
      setNewMenuItem({
        name: '',
        description: '',
        price: '',
        category: '',
        isVeg: true,
        prepTimeX: '',
        packTimeY: '',
        deliveryTimeZ: '',
        imageUrl: '',
        isAvailable: true,
      });
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('Failed to add menu item. Please try again.');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, we'll use a placeholder. In production, upload to cloud storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMenuItem({ ...newMenuItem, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

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
        <div className="flex gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-2xl flex-1 p-5 shadow-md relative overflow-hidden">
            <div className="text-sm font-medium mb-1 opacity-90">Orders {period}</div>
            <div className="text-4xl font-bold mb-1">{periodOrders.length}</div>
            <div className="text-xs opacity-75">&nbsp;</div>
            <span className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-2.5">
              <ShoppingBag className="w-6 h-6 text-white" />
            </span>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl flex-1 p-5 shadow-md relative overflow-hidden">
            <div className="text-sm font-medium mb-1 opacity-90">Revenue {period}</div>
            <div className="text-4xl font-bold mb-1">
              ₹{
                periodOrders
                  .filter(o => o.status && (o.status.toLowerCase() === 'delivered' || o.status.toLowerCase() === 'done'))
                  .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
              }
            </div>
            <div className="text-xs opacity-75">&nbsp;</div>
            <span className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-2.5">
              <CreditCard className="w-6 h-6 text-white" />
            </span>
          </div>
          <div className="bg-white rounded-2xl flex-1 p-5 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="text-sm font-medium mb-1 text-gray-700">Avg Order Value</div>
            <div className="text-4xl font-bold mb-1 text-gray-900">₹{avgOrderValue}</div>
            <div className="text-xs text-gray-500">{periodOrders.length > 0 ? '' : 'No orders yet'}</div>
            <span className="absolute top-4 right-4 bg-orange-50 rounded-xl p-2.5">
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </span>
          </div>
          <div className="bg-white rounded-2xl flex-1 p-5 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="text-sm font-medium mb-1 text-gray-700">Active Customers</div>
            <div className="text-4xl font-bold mb-1 text-gray-900">{activeCustomers}</div>
            <div className="text-xs text-gray-500">{newCustomersCount} {newCustomersLabel}</div>
            <span className="absolute top-4 right-4 bg-orange-50 rounded-xl p-2.5">
              <User className="w-6 h-6 text-orange-500" />
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
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200"
                placeholder="Search by customer name or order ID..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
              />
            </div>
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
                <div key={order.id} className="bg-white rounded-xl p-4 mb-3 flex items-center gap-3 shadow">
                  <div className="bg-gray-100 rounded-full p-3 flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
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
            <button 
              className="bg-orange-500 text-white w-full py-3 rounded-lg font-semibold mb-6 hover:bg-orange-600 transition"
              onClick={() => setShowAddItemDialog(true)}
            >
              + Add Item
            </button>
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

        {/* Add Menu Item Dialog */}
        {showAddItemDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Add New Menu Item</h2>
                <button 
                  onClick={() => setShowAddItemDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddMenuItem} className="p-6 space-y-5">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Food Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition">
                    {newMenuItem.imageUrl ? (
                      <div className="relative">
                        <img 
                          src={newMenuItem.imageUrl} 
                          alt="Preview" 
                          className="max-h-40 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setNewMenuItem({ ...newMenuItem, imageUrl: '' })}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">Click to upload image</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Food Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMenuItem.name}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                    placeholder="e.g., Paneer Butter Masala"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description / Ingredients <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={newMenuItem.description}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                    placeholder="e.g., Paneer 250g, Butter 50g, Cream 100ml, Tomatoes 200g"
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Category and Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      required={!showCustomCategory}
                      value={showCustomCategory ? 'custom' : newMenuItem.category}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setShowCustomCategory(true);
                          setNewMenuItem({ ...newMenuItem, category: '' });
                        } else {
                          setShowCustomCategory(false);
                          setCustomCategory('');
                          setNewMenuItem({ ...newMenuItem, category: e.target.value });
                        }
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="custom">+ Add New Category</option>
                    </select>
                    {showCustomCategory && (
                      <input
                        type="text"
                        required
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Enter new category name"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mt-2"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={newMenuItem.price}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                      placeholder="e.g., 300"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Time Fields */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prep Time (min)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newMenuItem.prepTimeX}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, prepTimeX: e.target.value })}
                      placeholder="15"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pack Time (min)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newMenuItem.packTimeY}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, packTimeY: e.target.value })}
                      placeholder="5"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Time (min)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newMenuItem.deliveryTimeZ}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, deliveryTimeZ: e.target.value })}
                      placeholder="20"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMenuItem.isVeg}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, isVeg: e.target.checked })}
                      className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMenuItem.isAvailable}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, isAvailable: e.target.checked })}
                      className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Available</span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddItemDialog(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;