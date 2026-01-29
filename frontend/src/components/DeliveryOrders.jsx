import React, { useState, useEffect } from 'react';
import DeliverySidebar from './DeliverySidebar';
import { Search, Clock, MapPin, User, Package, Truck, Check } from 'lucide-react';
import { orderService } from '../services/api';

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getAllOrders();
        // Filter orders that are ready for delivery or already assigned
        const deliveryOrders = data.filter(order => 
          order.status === 'Ready' || order.status === 'OnTheWay' || order.status === 'Delivered'
        );
        setOrders(deliveryOrders);
        setError(null);
      } catch (err) {
        console.error('Error fetching delivery orders:', err);
        setError('Failed to load orders. Please try again.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ready': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'OnTheWay': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Ready': return 'Ready for Pickup';
      case 'OnTheWay': return 'Out for Delivery';
      case 'Delivered': return 'Delivered';
      default: return status;
    }
  };

  const handleAssignDelivery = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, 'OnTheWay');
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'OnTheWay' } : order
      ));
    } catch (err) {
      console.error('Error assigning delivery:', err);
      alert('Failed to assign delivery. Please try again.');
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, 'Delivered');
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'Delivered' } : order
      ));
    } catch (err) {
      console.error('Error marking as delivered:', err);
      alert('Failed to mark as delivered. Please try again.');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id?.toString().includes(searchQuery);
    
    const matchesFilter = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DeliverySidebar />
      
      <main className="flex-1 p-8 ml-64 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Orders</h1>
          <p className="text-gray-600">Manage orders ready for delivery and track deliveries</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by customer name or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            {['All', 'Ready', 'OnTheWay', 'Delivered'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {status === 'OnTheWay' ? 'On the Way' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading delivery orders...</div>
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
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No delivery orders found</p>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Order #ORD-{order.id}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatTimeAgo(order.orderTime)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Customer:</span>
                      <span className="text-gray-700">{order.customerName || 'Unknown Customer'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <span className="font-medium">Address:</span>
                        <p className="text-gray-700">{order.addressFull || 'Address not available'}</p>
                        {order.addressApartment && (
                          <p className="text-sm text-gray-500">Apt: {order.addressApartment}</p>
                        )}
                        {order.addressInstructions && (
                          <p className="text-sm text-gray-500">Note: {order.addressInstructions}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Amount:</span>
                      <span className="text-lg font-bold text-orange-600">₹{order.totalAmount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items:</span>
                      <span className="text-gray-800">{order.orderItems?.length || 0} item(s)</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">Order Items:</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      {order.orderItems.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-sm text-gray-700">
                            {item.quantity}x {item.menuItemName || item.productName || 'Unknown Item'}
                          </span>
                          <span className="text-sm font-medium text-gray-800">₹{item.price || 0}</span>
                        </div>
                      ))}
                      {order.orderItems.length > 3 && (
                        <div className="text-sm text-gray-500 pt-1">
                          +{order.orderItems.length - 3} more item(s)
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  {order.status === 'Ready' && (
                    <button
                      onClick={() => handleAssignDelivery(order.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Truck className="w-4 h-4" />
                      Assign for Delivery
                    </button>
                  )}
                  
                  {order.status === 'OnTheWay' && (
                    <button
                      onClick={() => handleMarkDelivered(order.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Mark as Delivered
                    </button>
                  )}

                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DeliveryOrders;