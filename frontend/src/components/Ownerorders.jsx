import React, { useState, useEffect } from 'react';
import { Search, Bell, Package, Clock, CheckCircle, Truck, X, Check, User } from 'lucide-react';
import Sidebar from './Sidebar';
import { orderService } from '../services/api';

const Ownerorders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [period, setPeriod] = useState('Today');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getAllOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper function to format time
  const formatTimeAgo = (orderTime) => {
    if (!orderTime) return 'Unknown time';
    const now = new Date();
    const orderDate = new Date(orderTime);
    const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  // Helper function to get status from backend format
  const getOrderStatus = (order) => {
    if (!order.status) return 'pending';
    const status = order.status.toLowerCase();
    if (status.includes('placed') || status.includes('pending')) return 'pending';
    if (status.includes('accept')) return 'accepted';
    if (status.includes('prepar')) return 'preparing';
    if (status.includes('ready')) return 'ready';
    if (status.includes('cancel')) return 'cancelled';
    if (status.includes('done') || status.includes('delivered')) return 'done';
    return 'pending';
  };

  // Calculate period boundaries
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Helper to parse order time
  const parseOrderTime = o => o.orderTime ? new Date(o.orderTime) : (o.createdAt ? new Date(o.createdAt) : null);

  // Filter orders by selected period
  let periodOrders = orders;
  if (period === 'Today') {
    periodOrders = orders.filter(o => {
      const t = parseOrderTime(o);
      return t && t >= todayStart;
    });
  } else if (period === 'This Week') {
    periodOrders = orders.filter(o => {
      const t = parseOrderTime(o);
      return t && t >= weekStart;
    });
  } else if (period === 'This Month') {
    periodOrders = orders.filter(o => {
      const t = parseOrderTime(o);
      return t && t >= monthStart;
    });
  }

  // Transform backend orders to match component format
  const transformedOrders = periodOrders.map(order => ({
    id: `ORD-${order.id}`,
    rawId: order.id, // Keep original ID for API calls
    customer: order.customerName || order.user?.name || 'Unknown Customer',
    time: formatTimeAgo(order.orderTime || order.createdAt),
    amount: order.totalAmount || 0,
    status: getOrderStatus(order),
    timestamp: new Date(order.orderTime || order.createdAt || 0), // Keep original timestamp for sorting
    originalOrder: order // Keep reference to original order data
  })).sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first

  // Function to handle order click
  const handleOrderClick = async (order) => {
    try {
      // Fetch detailed order information
      const detailedOrder = await orderService.getOrderById(order.rawId);
      setSelectedOrder(detailedOrder);
      setShowOrderDialog(true);
    } catch (err) {
      console.error('Error fetching order details:', err);
      // Fallback to basic order data
      setSelectedOrder(order.originalOrder);
      setShowOrderDialog(true);
    }
  };

  const tabs = [
    { key: 'all', label: 'All', count: transformedOrders.length, icon: Package },
    { key: 'pending', label: 'Pending', count: transformedOrders.filter(o => o.status === 'pending').length, icon: Clock },
    { key: 'accepted', label: 'Accepted', count: transformedOrders.filter(o => o.status === 'accepted').length, icon: CheckCircle },
    { key: 'ready', label: 'Ready', count: transformedOrders.filter(o => o.status === 'ready').length, icon: Truck },
    { key: 'cancel', label: 'Cancel', count: transformedOrders.filter(o => o.status === 'cancelled').length, icon: X },
    { key: 'done', label: 'Done', count: transformedOrders.filter(o => o.status === 'done').length, icon: Check }
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      preparing: 'bg-blue-100 text-blue-800 border-blue-200',
      ready: 'bg-green-100 text-green-800 border-green-200',
      accepted: 'bg-purple-100 text-purple-800 border-purple-200',
      done: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const statusLabels = {
      pending: 'Pending',
      cancelled: 'Cancelled',
      preparing: 'Preparing',
      ready: 'Ready',
      accepted: 'Accepted',
      done: 'Done'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab="orders" />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
            <p className="text-gray-600">Manage incoming orders and track their status.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Period Filter */}
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
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
              />
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </div>
          </div>
        </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              {tab.label}
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                activeTab === tab.key ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading orders...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(() => {
            let filteredOrders = transformedOrders;
            
            // Filter by status
            if (activeTab !== 'all') {
              filteredOrders = filteredOrders.filter(order => order.status === activeTab);
            }
            
            // Filter by search query
            if (searchQuery.trim()) {
              const query = searchQuery.toLowerCase();
              filteredOrders = filteredOrders.filter(order => 
                order.customer.toLowerCase().includes(query) ||
                order.id.toString().toLowerCase().includes(query)
              );
            }
            
            if (filteredOrders.length === 0) {
              return (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No orders found</p>
                  <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                </div>
              );
            }
            
            return filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 
                    className="text-lg font-semibold text-orange-600 cursor-pointer hover:text-orange-700 transition-colors"
                    onClick={() => handleOrderClick(order)}
                  >
                    {order.id}
                  </h3>
                  {getStatusBadge(order.status)}
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-2 mb-3 text-gray-600">
                  <User className="w-4 h-4" />
                  <span 
                    className="text-sm cursor-pointer hover:text-gray-800 transition-colors"
                    onClick={() => handleOrderClick(order)}
                  >
                    {order.customer}
                  </span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-2 mb-4 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{order.time}</span>
                </div>

                {/* Total Amount */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-gray-900">₹{order.amount}</p>
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {/* Order Details Dialog */}
      {showOrderDialog && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
              <button 
                onClick={() => setShowOrderDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-orange-600">ORD-{selectedOrder.id}</h3>
                  {getStatusBadge(getOrderStatus(selectedOrder))}
                </div>
                <p className="text-sm text-gray-600">
                  Order Time: {selectedOrder.orderTime ? new Date(selectedOrder.orderTime).toLocaleString() : 'N/A'}
                </p>
              </div>

              {/* Customer Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span>{selectedOrder.customerName || selectedOrder.user?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 text-gray-500">📞</span>
                    <span className="font-medium">Phone:</span>
                    <span>{selectedOrder.customerPhone || 'N/A'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 text-gray-500 mt-1">📍</span>
                    <span className="font-medium">Address:</span>
                    <span className="flex-1">
                      {selectedOrder.addressFull || 
                       (selectedOrder.addressApartment ? `${selectedOrder.addressApartment}, ` : '') + 
                       (selectedOrder.addressLabel || '') || 
                       'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h4>
                {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                  <div className="space-y-3">
                    {selectedOrder.orderItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800">
                            {item.menuItemName || item.productName || 'Unknown Item'}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {item.menuItemDescription || ''}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity || 1}
                          </p>
                          {item.menuItemCategory && (
                            <p className="text-xs text-gray-400">
                              Category: {item.menuItemCategory}
                            </p>
                          )}
                        </div>
                        {item.menuItemImageUrl && (
                          <div className="w-16 h-16 ml-3">
                            <img 
                              src={`/src/assets/food/${item.menuItemImageUrl}`}
                              alt={item.menuItemName || item.productName}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="text-right ml-3">
                          <p className="font-semibold text-gray-800">
                            ₹{item.price || item.menuItem?.price || 0}
                          </p>
                          <p className="text-sm text-gray-600">
                            Total: ₹{(item.quantity || 1) * (item.price || item.menuItem?.price || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No items found for this order</p>
                )}
              </div>

              {/* Total Amount */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                  <span className="text-2xl font-bold text-orange-600">₹{selectedOrder.totalAmount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
};

export default Ownerorders;