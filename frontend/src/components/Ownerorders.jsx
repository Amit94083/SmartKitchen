import React, { useState, useEffect } from 'react';
import { Search, Bell, Package, Clock, CheckCircle, Truck, X, Check, User, UserCheck, Undo2 } from 'lucide-react';
import Sidebar from './Sidebar';
import { orderService } from '../services/api';
import useOrderSSE from '../hooks/useOrderSSE';

const Ownerorders = () => {
  const [activeTab, setActiveTab] = useState('all'); // Always start with 'all' tab
  const [searchQuery, setSearchQuery] = useState('');
  const [period, setPeriod] = useState('All Time');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Function to update active tab (removed localStorage persistence)
  const updateActiveTab = (tabKey) => {
    setActiveTab(tabKey);
  };

  // Enable real-time order updates via SSE
  useOrderSSE(setOrders);

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

  // Helper function to get preparation time estimate
  const getPreparationTime = (order) => {
    // Check if backend has preparation time field
    if (order.preparationTimeMinutes) {
      return `Est. ${order.preparationTimeMinutes} mins remaining`;
    }
    // Fallback: estimate based on number of items
    const itemCount = order.orderItems?.length || 1;
    const estimatedTime = Math.max(15, itemCount * 5); // Minimum 15 mins, 5 mins per item
    return `Est. ${estimatedTime} mins remaining`;
  };

  // Helper function to map backend PascalCase status to UI status
  const getOrderStatus = (order) => {
    if (!order.status) return 'Placed';
    switch (order.status) {
      case 'Placed': return 'Placed';
      case 'Confirmed': return 'Confirmed';
      case 'Preparing': return 'Preparing';
      case 'Ready': return 'Ready';
      case 'OnTheWay': return 'OnTheWay';
      case 'Delivered': return 'Delivered';
      case 'Cancelled': return 'Cancelled';
      default: return order.status;
    }
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

  // Accept order handler
  const handleAccept = async (order) => {
    try {
      await orderService.updateOrderStatus(order.rawId, 'Confirmed');
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === order.rawId ? { ...o, status: 'Confirmed' } : o
        )
      );
      updateActiveTab('Confirmed');
    } catch (err) {
      console.error('Error accepting order:', err);
      alert('Failed to accept order. Please try again.');
    }
  };

  // Reject order handler
  const handleReject = async (order) => {
    try {
      await orderService.updateOrderStatus(order.rawId, 'Cancelled'); 
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === order.rawId ? { ...o, status: 'Cancelled' } : o
        )
      );
      updateActiveTab('Cancelled');
    } catch (err) {
      console.error('Error rejecting order:', err);
      alert('Failed to reject order. Please try again.');
    }
  };

  // Ready order handler
  const handleReady = async (order) => {
    try {
      // Call backend to update status
      await orderService.updateOrderStatus(order.rawId, 'Ready');
      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === order.rawId ? { ...o, status: 'Ready' } : o
        )
      );
      // Switch to Ready tab
      updateActiveTab('Ready');
    } catch (err) {
      console.error('Error marking order as ready:', err);
      alert('Failed to mark order as ready. Please try again.');
    }
  };

  // Start preparing order handler
  const handleStartPreparing = async (order) => {
    try {
      // Call backend to update status
      await orderService.updateOrderStatus(order.rawId, 'Preparing');
      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === order.rawId ? { ...o, status: 'Preparing' } : o
        )
      );
      // Switch to Preparing tab
      updateActiveTab('Preparing');
    } catch (err) {
      console.error('Error starting order preparation:', err);
      alert('Failed to start order preparation. Please try again.');
    }
  };

  // Assign delivery partner handler
  const handleAssignDelivery = async (order) => {
    try {
      // Redirect to delivery assign orders page for assignment
      window.location.href = '/delivery/assign-orders';
    } catch (err) {
      console.error('Error redirecting to delivery assign orders page:', err);
      alert('Failed to redirect to delivery assign orders page. Please try again.');
    }
  };

  // Revert order status handler
  const handleRevertStatus = async (order) => {
    try {
      let previousStatus;
      // Determine the previous status based on current status
      switch (order.status) {
        case 'Confirmed':
          previousStatus = 'Placed';
          break;
        case 'Preparing':
          previousStatus = 'Confirmed';
          break;
        case 'Ready':
          previousStatus = 'Preparing';
          break;
        default:
          console.warn('No previous status available for', order.status);
          return;
      }

      // Call backend to update status
      await orderService.updateOrderStatus(order.rawId, previousStatus);
      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === order.rawId ? { ...o, status: previousStatus } : o
        )
      );
      // Switch to the previous status tab
      updateActiveTab(previousStatus);
    } catch (err) {
      console.error('Error reverting order status:', err);
      alert('Failed to revert order status. Please try again.');
    }
  };

  const tabs = [
    { key: 'all', label: 'All', count: transformedOrders.length, icon: Package },
    { key: 'Placed', label: 'Placed', count: transformedOrders.filter(o => o.status === 'Placed').length, icon: Clock },
    { key: 'Confirmed', label: 'Confirmed', count: transformedOrders.filter(o => o.status === 'Confirmed').length, icon: CheckCircle },
    { key: 'Preparing', label: 'Preparing', count: transformedOrders.filter(o => o.status === 'Preparing').length, icon: Truck },
    { key: 'Ready', label: 'Ready', count: transformedOrders.filter(o => o.status === 'Ready').length, icon: Truck },
    { key: 'Assigned', label: 'Assigned', count: transformedOrders.filter(o => o.status === 'Assigned').length, icon: UserCheck },
    { key: 'OnTheWay', label: 'On the Way', count: transformedOrders.filter(o => o.status === 'OnTheWay').length, icon: Truck },
    { key: 'Delivered', label: 'Delivered', count: transformedOrders.filter(o => o.status === 'Delivered').length, icon: Check },
    { key: 'Cancelled', label: 'Cancelled', count: transformedOrders.filter(o => o.status === 'Cancelled').length, icon: X }
  ];

  const getStatusBadge = (status) => {

    const statusStyles = {
      Placed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      Preparing: 'bg-blue-100 text-blue-800 border-blue-200',
      Ready: 'bg-green-100 text-green-800 border-green-200',
      Assigned: 'bg-purple-100 text-purple-800 border-purple-200',
      OnTheWay: 'bg-orange-100 text-orange-800 border-orange-200',
      Delivered: 'bg-gray-100 text-gray-800 border-gray-200',
      Cancelled: 'bg-red-100 text-red-800 border-red-200'
    };

    const statusLabels = {
      Placed: 'Placed',
      Confirmed: 'Confirmed',
      Preparing: 'Preparing',
      Ready: 'Ready',
      Assigned: 'Assigned',
      OnTheWay: 'On the Way',
      Delivered: 'Delivered',
      Cancelled: 'Cancelled'
    };

    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status] || ''}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab="orders" />
      <main className="flex-1 p-4 ml-72 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">Orders</h1>
            <p className="text-sm text-gray-600">Manage incoming orders and track their status.</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Period Filter */}
            <div className="flex gap-1 bg-white rounded-lg shadow px-1 py-0.5">
              {['All Time', 'Today', 'This Week', 'This Month'].map(p => (
                <button
                  key={p}
                  className={
                    (period === p ? 'bg-orange-500 text-white font-medium' : 'text-gray-600') +
                    ' px-2 py-1 rounded-md text-xs'
                  }
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent w-48 text-sm"
              />
            </div>
          </div>
        </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => updateActiveTab(tab.key)}
              className={`flex items-center gap-1 px-3 py-2 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${
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
        <div className="space-y-3">
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
                className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow"
              >
                {/* Single Line Layout */}
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Order Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <h3 
                      className="text-sm font-semibold text-orange-600 cursor-pointer hover:text-orange-700 transition-colors whitespace-nowrap"
                      onClick={() => handleOrderClick(order)}
                    >
                      {order.id}
                    </h3>
                    {getStatusBadge(order.status)}
                    <div className="flex items-center gap-1 text-gray-600 min-w-0">
                      <User className="w-3 h-3 flex-shrink-0" />
                      <span 
                        className="text-xs cursor-pointer hover:text-gray-800 transition-colors truncate"
                        onClick={() => handleOrderClick(order)}
                      >
                        {order.customer}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs whitespace-nowrap">{order.time}</span>
                    </div>
                    <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
                      ₹{order.amount}
                    </div>
                  </div>
                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {order.status === 'Placed' ? (
                      <>
                        <button
                          className="flex items-center gap-1 px-2 py-1 border border-red-300 text-red-600 bg-white rounded text-xs font-medium hover:bg-red-50 transition"
                          onClick={() => handleReject(order)}
                        >
                          <X className="w-3 h-3" />
                          Reject
                        </button>
                        <button
                          className="flex items-center gap-1 px-2 py-1 bg-orange-500 text-white rounded text-xs font-medium hover:bg-orange-600 transition"
                          onClick={() => handleAccept(order)}
                        >
                          <Check className="w-3 h-3" />
                          Accept
                        </button>
                      </>
                    ) : order.status === 'Confirmed' ? (
                      <>
                        <button
                          className="flex items-center gap-1 px-2 py-1 border border-gray-300 text-gray-600 bg-white rounded text-xs font-medium hover:bg-gray-50 transition"
                          onClick={() => handleRevertStatus(order)}
                        >
                          <Undo2 className="w-3 h-3" />
                          Revert to Placed
                        </button>
                        <button
                          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 transition"
                          onClick={() => handleStartPreparing(order)}
                        >
                          <Package className="w-3 h-3" />
                          Start Preparing
                        </button>
                      </>
                    ) : order.status === 'Preparing' ? (
                      <>
                        <button
                          className="flex items-center gap-1 px-2 py-1 border border-gray-300 text-gray-600 bg-white rounded text-xs font-medium hover:bg-gray-50 transition"
                          onClick={() => handleRevertStatus(order)}
                        >
                          <Undo2 className="w-3 h-3" />
                          Revert to Confirmed
                        </button>
                        <button
                          className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 transition"
                          onClick={() => handleReady(order)}
                        >
                          <Check className="w-3 h-3" />
                          Mark Ready
                        </button>
                      </>
                    ) : order.status === 'Ready' ? (
                      <>
                        <button
                          className="flex items-center gap-1 px-2 py-1 border border-gray-300 text-gray-600 bg-white rounded text-xs font-medium hover:bg-gray-50 transition"
                          onClick={() => handleRevertStatus(order)}
                        >
                          <Undo2 className="w-3 h-3" />
                          Revert to Preparing
                        </button>
                        <button
                          className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded text-xs font-medium hover:bg-orange-600 transition"
                          onClick={() => handleAssignDelivery(order)}
                        >
                          <Truck className="w-3 h-3" />
                          Assign Delivery
                        </button>
                      </>
                    ) : null}
                  </div>
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