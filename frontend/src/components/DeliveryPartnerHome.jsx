import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService, userService } from '../services/api';
import { Package, Clock, MapPin, Phone, User, Truck, CheckCircle, LogOut, TrendingUp, DollarSign, Star, Navigation, ChevronDown, ChevronUp, Eye, X } from 'lucide-react';
import useOrderSSE from '../hooks/useOrderSSE';

const DeliveryPartnerHome = () => {
  const { user, logout } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLifetimeOrders, setShowLifetimeOrders] = useState(false);
  const [lifetimeOrders, setLifetimeOrders] = useState([]);
  const [showCompletedTodayOrders, setShowCompletedTodayOrders] = useState(false);
  const [completedTodayOrders, setCompletedTodayOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [stats, setStats] = useState({
    activeDeliveries: 0,
    completedToday: 0,
    lifetimeDeliveries: 0
  });

  // Enable real-time order updates via SSE
  useOrderSSE(setAllOrders);

  // Process orders when allOrders updates via SSE
  useEffect(() => {
    if (!userId) return;

    const assignedOrders = allOrders.filter(order => 
      order.deliveryPartnerId === parseInt(userId) && 
      ['Assigned', 'OnTheWay'].includes(order.status)
    );
    setOrders(assignedOrders);

    // Recalculate stats
    const today = new Date().toDateString();
    const completedTodayFiltered = allOrders.filter(order => 
      order.deliveryPartnerId === parseInt(userId) &&
      order.status === 'Delivered' &&
      order.deliveredAt &&
      new Date(order.deliveredAt).toDateString() === today
    );
    const lifetimeFiltered = allOrders.filter(order => 
      order.deliveryPartnerId === parseInt(userId) && 
      order.status === 'Delivered'
    );

    setCompletedTodayOrders(completedTodayFiltered);
    setLifetimeOrders(lifetimeFiltered);
    setStats({
      activeDeliveries: assignedOrders.length,
      completedToday: completedTodayFiltered.length,
      lifetimeDeliveries: lifetimeFiltered.length
    });
  }, [allOrders, userId]);

  useEffect(() => {
    fetchAssignedOrders();
    fetchUserStatus();
  }, [userId]);

  const fetchUserStatus = async () => {
    try {
      const profile = await userService.getProfile(userId);
      setIsActive(profile.isActive !== undefined ? profile.isActive : profile.active || false);
    } catch (err) {
      console.error('Error fetching user status:', err);
      setIsActive(false);
    }
  };

  const fetchAssignedOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await orderService.getAllOrders();
      
      // Filter orders assigned to this delivery partner
      const assignedOrders = allOrders.filter(order => 
        order.deliveryPartnerId === parseInt(userId) && 
        ['Assigned', 'OnTheWay'].includes(order.status)
      );
      
      // Calculate stats
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const completedToday = allOrders.filter(order => 
        order.deliveryPartnerId === parseInt(userId) && 
        order.status === 'Delivered' &&
        new Date(order.deliveredAt) >= todayStart
      );
      
      const lifetimeDeliveries = allOrders.filter(order => 
        order.deliveryPartnerId === parseInt(userId) && 
        order.status === 'Delivered'
      );
      
      setStats({
        activeDeliveries: assignedOrders.length,
        completedToday: completedToday.length,
        lifetimeDeliveries: lifetimeDeliveries.length
      });
      
      setOrders(assignedOrders);
      setCompletedTodayOrders(completedToday);
      setLifetimeOrders(lifetimeDeliveries);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      // Refresh orders after status update
      fetchAssignedOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleActiveStatus = async () => {
    try {
      setUpdatingStatus(true);
      const newStatus = !isActive;
      await userService.updateUserStatus(userId, newStatus);
      setIsActive(newStatus);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Assigned':
        return 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300';
      case 'OnTheWay':
        return 'bg-blue-100 text-blue-800 border-2 border-blue-300';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-2 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-2 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  Delivery Partner Dashboard
                </h1>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  Welcome back, {user?.name || 'Partner'}!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleActiveStatus}
                disabled={updatingStatus}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all transform hover:scale-105 ${
                  isActive 
                    ? 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200'
                } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className={`inline-block w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                {updatingStatus ? 'Updating...' : (isActive ? 'Active' : 'Inactive')}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all transform hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 animate-in">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Deliveries */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-6 transform hover:scale-105 transition-all hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Active Deliveries</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.activeDeliveries}</p>
            <p className="text-xs text-gray-500 mt-2">Currently on the way</p>
          </div>

          {/* Completed Today */}
          <div 
            onClick={() => setShowCompletedTodayOrders(!showCompletedTodayOrders)}
            className="bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-6 transform hover:scale-105 transition-all hover:shadow-xl cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              {showCompletedTodayOrders ? (
                <ChevronUp className="w-5 h-5 text-orange-500" />
              ) : (
                <Eye className="w-5 h-5 text-orange-500" />
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Completed Today</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.completedToday}</p>
            <p className="text-xs text-gray-500 mt-2">Click to {showCompletedTodayOrders ? 'hide' : 'view'} orders</p>
          </div>

          {/* All time deliveries */}
          <div 
            onClick={() => setShowLifetimeOrders(!showLifetimeOrders)}
            className="bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-6 transform hover:scale-105 transition-all hover:shadow-xl cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              {showLifetimeOrders ? (
                <ChevronUp className="w-5 h-5 text-orange-500" />
              ) : (
                <Eye className="w-5 h-5 text-orange-500" />
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">All time deliveries</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.lifetimeDeliveries}</p>
            <p className="text-xs text-gray-500 mt-2">Click to {showLifetimeOrders ? 'hide' : 'view'} all orders</p>
          </div>
        </div>

        {/* Completed Today Orders List */}
        {showCompletedTodayOrders && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-orange-600" />
                Today's Delivered Orders
              </h2>
              <button
                onClick={() => setShowCompletedTodayOrders(false)}
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-xl font-medium hover:bg-orange-200 transition-all"
              >
                Close
              </button>
            </div>
            
            {completedTodayOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders delivered today yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {completedTodayOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-gradient-to-r from-orange-50 to-white rounded-xl border-2 border-orange-100 p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 
                            className="text-lg font-bold text-orange-600 cursor-pointer hover:text-orange-700 transition-colors"
                            onClick={() => setSelectedOrder(order)}
                          >
                            ORD-{order.id}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)} shadow-sm`}>
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-700 font-medium">{order.customerName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-orange-600" />
                            <a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:underline font-medium">
                              {order.customerPhone || 'N/A'}
                            </a>
                          </div>
                          
                          <div className="flex items-center gap-2 md:col-span-2">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span className="text-gray-600">
                              {new Date(order.deliveredAt || order.createdAt).toLocaleDateString()} at{' '}
                              {new Date(order.deliveredAt || order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        
                        {order.deliveryAddress && (
                          <div className="flex items-start gap-2 mt-3 bg-white rounded-lg p-2">
                            <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                            <span className="text-sm text-gray-700">{order.deliveryAddress || order.addressFull}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Lifetime Orders List */}
        {showLifetimeOrders && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-6 h-6 text-orange-600" />
                All time delivered orders
              </h2>
              <button
                onClick={() => setShowLifetimeOrders(false)}
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-xl font-medium hover:bg-orange-200 transition-all"
              >
                Close
              </button>
            </div>
            
            {lifetimeOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No delivered orders yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {lifetimeOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-gradient-to-r from-orange-50 to-white rounded-xl border-2 border-orange-100 p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 
                            className="text-lg font-bold text-orange-600 cursor-pointer hover:text-orange-700 transition-colors"
                            onClick={() => setSelectedOrder(order)}
                          >
                            ORD-{order.id}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)} shadow-sm`}>
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-700 font-medium">{order.customerName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-600" />
                            <a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:underline font-medium">
                              {order.customerPhone || 'N/A'}
                            </a>
                          </div>
                          
                          <div className="flex items-center gap-2 md:col-span-2">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span className="text-gray-600">
                              {new Date(order.deliveredAt || order.createdAt).toLocaleDateString()} at{' '}
                              {new Date(order.deliveredAt || order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        
                        {order.deliveryAddress && (
                          <div className="flex items-start gap-2 mt-3 bg-white rounded-lg p-2">
                            <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                            <span className="text-sm text-gray-700">{order.deliveryAddress || order.addressFull}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Package className="w-6 h-6" />
                      ORD-{selectedOrder.id}
                    </h2>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Customer Information */}
                <div className="bg-gradient-to-r from-purple-50 to-white rounded-xl p-4 border-2 border-purple-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    Customer Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Name:</span>
                      <span className="text-sm text-gray-900 font-semibold">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      <a href={`tel:${selectedOrder.customerPhone}`} className="text-sm text-blue-600 hover:underline font-medium">
                        {selectedOrder.customerPhone || 'N/A'}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                {selectedOrder.deliveryAddress && (
                  <div className="bg-gradient-to-r from-red-50 to-white rounded-xl p-4 border-2 border-red-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-600" />
                      Delivery Address
                    </h3>
                    <p className="text-sm text-gray-700">{selectedOrder.deliveryAddress || selectedOrder.addressFull}</p>
                  </div>
                )}

                {/* Order Items */}
                {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-white rounded-xl p-4 border-2 border-orange-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-orange-600" />
                      Order Items ({selectedOrder.orderItems.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.orderItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                          <div>
                            <p className="font-medium text-gray-900">{item.menuItemName || item.productName}</p>
                            <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <span className="text-lg font-bold text-orange-600">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t-2 border-orange-200 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                      <span className="text-2xl font-bold text-orange-600">₹{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                )}

                {/* Order Timeline */}
                <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-4 border-2 border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Order Timeline
                  </h3>
                  <div className="space-y-2 text-sm">
                    {(selectedOrder.createdAt || selectedOrder.orderPlacedAt) && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Placed:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(selectedOrder.createdAt || selectedOrder.orderPlacedAt).toLocaleDateString()} at{' '}
                          {new Date(selectedOrder.createdAt || selectedOrder.orderPlacedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    {selectedOrder.deliveredAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivered At:</span>
                        <span className="text-green-700 font-medium">
                          {new Date(selectedOrder.deliveredAt).toLocaleDateString()} at{' '}
                          {new Date(selectedOrder.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-2xl border-t-2 border-gray-200">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all transform hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-gray-100">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders assigned</h3>
            <p className="text-gray-500">Check back later for new delivery assignments.</p>
            <div className="mt-6">
              <button
                onClick={fetchAssignedOrders}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all transform hover:scale-105 shadow-lg"
              >
                Refresh Orders
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Your Assigned Orders</h2>
              <button
                onClick={fetchAssignedOrders}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all transform hover:scale-105 shadow-sm"
              >
                <Clock className="w-4 h-4 inline mr-2" />
                Refresh
              </button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{orders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden transform hover:scale-105 transition-all hover:shadow-2xl"
                >
                  {/* Colored top bar */}
                  <div className={`h-2 ${order.status === 'Assigned' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                  
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-orange-600 flex items-center gap-2">
                          <Package className="w-5 h-5 text-orange-500" />
                          ORD-{order.id}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()} at{' '}
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)} shadow-sm`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-3 mb-4 bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center">
                        <div className="bg-white p-2 rounded-lg mr-3 shadow-sm">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{order.customerName}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-white p-2 rounded-lg mr-3 shadow-sm">
                          <Phone className="w-4 h-4 text-green-600" />
                        </div>
                        <a href={`tel:${order.customerPhone}`} className="text-sm text-blue-600 hover:underline font-medium">
                          {order.customerPhone || 'N/A'}
                        </a>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-white p-2 rounded-lg mr-3 shadow-sm mt-0.5">
                          <MapPin className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-sm text-gray-700 flex-1">{order.deliveryAddress || order.addressFull || 'Address not available'}</span>
                      </div>
                    </div>

                    {/* Order Items */}
                    {order.orderItems && order.orderItems.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <Package className="w-4 h-4 text-orange-500" />
                          Order Items:
                        </h4>
                        <div className="space-y-2 bg-orange-50 rounded-xl p-3">
                          {order.orderItems.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-700 font-medium">
                                {item.menuItemName || item.productName} <span className="text-orange-600">x{item.quantity}</span>
                              </span>
                              <span className="text-gray-900 font-bold">₹{item.price}</span>
                            </div>
                          ))}
                          {order.orderItems.length > 3 && (
                            <p className="text-xs text-gray-500 italic">+{order.orderItems.length - 3} more items</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Total Amount */}
                    <div className="border-t-2 border-gray-100 pt-4 mb-4">
                      <div className="flex justify-between items-center bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3">
                        <span className="text-sm font-bold text-gray-700">Total Amount:</span>
                        <span className="text-xl font-bold text-orange-600">₹{order.totalAmount}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {order.status === 'Assigned' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'OnTheWay')}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-bold shadow-lg transform hover:scale-105"
                        >
                          <Navigation className="w-5 h-5" />
                          Start Delivery
                        </button>
                      )}
                      
                      {order.status === 'OnTheWay' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Delivered')}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-bold shadow-lg transform hover:scale-105"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Mark as Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryPartnerHome;