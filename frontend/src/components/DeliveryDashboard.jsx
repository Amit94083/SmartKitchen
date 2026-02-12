import React, { useState, useEffect } from 'react';
import DeliverySidebar from './DeliverySidebar';
import { useAuth } from '../context/AuthContext';
import { authService, orderService } from '../services/api';
import useOrderSSE from '../hooks/useOrderSSE';

const DeliveryDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [status, setStatus] = useState('OPEN');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    addressFull: '',
    addressApartment: ''
  });
  const [stats, setStats] = useState({
    activeOrders: 0,
    todaysDeliveries: 0,
    totalDeliveries: 0,
    avgDeliveryTime: 28
  });

  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);

  // Enable real-time order updates via SSE
  useOrderSSE(setAllOrders);

  // Filter and process orders when allOrders updates
  useEffect(() => {
    const assignedOrders = allOrders.filter(order => 
      ['Assigned', 'OnTheWay', 'Delivered'].includes(order.status)
    );
    setOrders(assignedOrders);
  }, [allOrders]);

  // Auto-refresh user data on component mount
  useEffect(() => {
    if (refreshUser) {
      refreshUser();
    }
  }, []); // Empty dependency array - only runs once on mount

  // Fetch assigned orders from the API
  useEffect(() => {
    const fetchAssignedOrders = async () => {
      try {
        const allOrders = await orderService.getAllOrders();
        
        // Filter orders by status - only include Assigned, OnTheWay, and Delivered orders
        const assignedOrders = allOrders
          .filter(order => ['Assigned', 'OnTheWay', 'Delivered'].includes(order.status))
          .map(async order => {
            // Map the order status to our UI status
            let status, statusLabel;
            switch (order.status) {
              case 'Assigned':
                status = 'assigned';
                statusLabel = 'Assigned';
                break;
              case 'OnTheWay':
                status = 'on-the-way';
                statusLabel = 'On The Way';
                break;
              case 'Delivered':
                status = 'delivered';
                statusLabel = 'Delivered';
                break;
              default:
                status = 'assigned';
                statusLabel = 'Assigned';
                break;
            }

            // Fetch delivery partner details if ID exists
            let deliveryPartner = { name: 'Not assigned', phone: 'N/A' };
            if (order.deliveryPartnerId) {
              try {
                const partnerResponse = await authService.getUserById(order.deliveryPartnerId);
                deliveryPartner = {
                  name: partnerResponse.name || 'Not assigned',
                  phone: partnerResponse.phone || 'N/A'
                };
              } catch (error) {
                console.error('Error fetching delivery partner details:', error);
              }
            }
            
            return {
              id: order.id,
              status: status,
              statusLabel: statusLabel,
              assignedTime: order.assignedAt ? new Date(order.assignedAt).toLocaleString() : 'Not assigned',
              deliveredTime: order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : null,
              amount: order.totalAmount,
              customer: {
                name: order.customerName || 'Customer',
                phone: order.customerPhone || 'N/A'
              },
              deliveryPartner: deliveryPartner,
              address: [order.addressApartment, order.addressFull]
                .filter(addr => addr && addr.trim())
                .join(', ') || 'Address not provided',
              instructions: order.addressInstructions || null,
              items: order.orderItems || [],
              deliveryPartnerId: order.deliveryPartnerId
            };
          });
        
        // Wait for all async operations to complete
        const resolvedOrders = await Promise.all(assignedOrders);
        setOrders(resolvedOrders);
        const today = new Date().toDateString();
        
        // For accurate counts, use the original API data before processing
        // Count active orders (Assigned + OnTheWay) from the original API data
        const activeOrdersCount = allOrders.filter(order => 
          order.status === 'Assigned' || order.status === 'OnTheWay'
        ).length;
        
        // For total deliveries, we can use the same API call
        const totalDeliveriesCount = allOrders.filter(order => 
          order.status === 'Delivered'
        ).length;
        
        // Count today's deliveries from all orders using delivered_at field
        const todaysDeliveriesCount = allOrders.filter(order => 
          order.status === 'Delivered' && 
          order.deliveredAt && new Date(order.deliveredAt).toDateString() === today
        ).length;
        
        // Calculate average delivery time from delivered orders
        const deliveredOrders = allOrders.filter(order => 
          order.status === 'Delivered' && order.deliveredAt && order.orderTime
        );
        
        let avgDeliveryTimeMinutes = 0;
        if (deliveredOrders.length > 0) {
          const totalDeliveryTime = deliveredOrders.reduce((total, order) => {
            const orderTime = new Date(order.orderTime);
            const deliveredTime = new Date(order.deliveredAt);
            const timeDifferenceMs = deliveredTime - orderTime;
            const timeDifferenceMinutes = Math.round(timeDifferenceMs / (1000 * 60));
            return total + timeDifferenceMinutes;
          }, 0);
          avgDeliveryTimeMinutes = Math.round(totalDeliveryTime / deliveredOrders.length);
        }
        
        setStats(prev => ({
          ...prev,
          activeOrders: activeOrdersCount,
          todaysDeliveries: todaysDeliveriesCount,
          totalDeliveries: totalDeliveriesCount,
          avgDeliveryTime: avgDeliveryTimeMinutes
        }));
        
      } catch (error) {
        console.error('Error fetching assigned orders:', error);
      }
    };

    fetchAssignedOrders();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAssignedOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const filterOrdersByTab = (orders) => {
    switch (activeTab) {
      case 'assigned':
        return orders.filter(order => order.status === 'assigned');
      case 'on-the-way':
        return orders.filter(order => order.status === 'on-the-way');
      case 'delivered':
        return orders.filter(order => order.status === 'delivered');
      default:
        return orders;
    }
  };

  const getTabCount = (status) => {
    switch (status) {
      case 'assigned':
        return orders.filter(order => order.status === 'assigned').length;
      case 'on-the-way':
        return orders.filter(order => order.status === 'on-the-way').length;
      case 'delivered':
        return orders.filter(order => order.status === 'delivered').length;
      default:
        return orders.length;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      assigned: 'bg-yellow-100 text-yellow-700',
      'picked-up': 'bg-orange-100 text-orange-700',
      'on-the-way': 'bg-blue-100 text-blue-700',
      delivered: 'bg-green-100 text-green-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getButtonConfig = (status) => {
    const configs = {
      assigned: {
        label: 'Start Delivery',
        icon: '🚗',
        color: 'bg-blue-500 hover:bg-blue-600',
        nextStatus: 'on-the-way'
      },
      'on-the-way': {
        label: 'Mark Delivered',
        icon: '✅',
        color: 'bg-green-500 hover:bg-green-600',
        nextStatus: 'delivered'
      }
    };
    return configs[status];
  };

  const handleStatusChange = async (orderId, currentStatus) => {
    const buttonConfig = getButtonConfig(currentStatus);
    if (buttonConfig) {
      try {
        // Map UI status to backend OrderStatus
        let backendStatus;
        switch (buttonConfig.nextStatus) {
          case 'on-the-way':
            backendStatus = 'OnTheWay';
            break;
          case 'delivered':
            backendStatus = 'Delivered';
            break;
          default:
            backendStatus = 'Assigned'; // Default fallback
        }
        
        // Update order status in backend
        await orderService.updateOrderStatus(orderId, backendStatus);
        
        // Update local state
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: buttonConfig.nextStatus, statusLabel: buttonConfig.label }
            : order
        ));

        // Update stats
        if (buttonConfig.nextStatus === 'delivered') {
          setStats(prev => ({
            ...prev,
            activeOrders: prev.activeOrders - 1,
            todaysDeliveries: prev.todaysDeliveries + 1
          }));
        }
      } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status. Please try again.');
      }
    }
  };

  const handleAddPartner = async () => {
    try {
      const partnerData = {
        name: newPartner.name,
        email: newPartner.email,
        phone: newPartner.phone,
        password: newPartner.password,
        userType: 'DELIVERY_PARTNER',
        addressLabel: 'Delivery Partner Address',
        addressFull: newPartner.addressFull,
        addressApartment: newPartner.addressApartment,
        addressInstructions: ''
      };
      
      console.log('Sending partner data:', partnerData); // Debug log
      const response = await authService.signup(partnerData);
      console.log('Backend response:', response); // Debug log
      
      // Reset form
      setNewPartner({
        name: '',
        email: '',
        phone: '',
        password: '',
        addressFull: '',
        addressApartment: ''
      });
      setShowAddPartnerModal(false);
    } catch (error) {
      console.error('Error adding delivery partner:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPartner(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DeliverySidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome, {user?.name || 'Delivery Manager'}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    <span className="text-sm font-semibold text-red-500">{status}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Add Delivery Partner Button */}
              <button
                onClick={() => setShowAddPartnerModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Partner</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Orders */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-600 font-medium">Active Orders</h3>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-800">{stats.activeOrders}</div>
              <p className="text-xs text-gray-500 mt-1">Currently assigned</p>
            </div>

            {/* Today's Deliveries */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-600 font-medium">Today's Deliveries</h3>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-800">{stats.todaysDeliveries}</div>
              <p className="text-xs text-gray-500 mt-1">Completed today</p>
            </div>

            {/* Total Deliveries */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-600 font-medium">Total Deliveries</h3>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-800">{stats.totalDeliveries}</div>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>

            {/* Avg. Delivery Time */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-600 font-medium">Avg. Delivery Time</h3>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-800">{stats.avgDeliveryTime} min</div>
              <p className="text-xs text-gray-500 mt-1">Per delivery</p>
            </div>
          </div>
        </div>

        {/* Orders Section with Tabs */}
        <div className="px-8 pb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Orders</h2>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All ({getTabCount('all')})
              </button>
              <button
                onClick={() => setActiveTab('assigned')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'assigned'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Assigned ({getTabCount('assigned')})
              </button>
              <button
                onClick={() => setActiveTab('on-the-way')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'on-the-way'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                On The Way ({getTabCount('on-the-way')})
              </button>
              <button
                onClick={() => setActiveTab('delivered')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'delivered'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Delivered ({getTabCount('delivered')})
              </button>
            </nav>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filterOrdersByTab(orders).map((order) => {
              const buttonConfig = getButtonConfig(order.status);
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-bold text-gray-800">{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.statusLabel}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-gray-800">₹{order.amount}</span>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {order.status === 'delivered' && order.deliveredTime ? (
                      <span className="text-green-600 font-medium">Delivered {order.deliveredTime}</span>
                    ) : (
                      <span>Assigned {order.assignedTime}</span>
                    )}
                  </div>

                  {/* Customer Info */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-1">{order.customer.name}</h4>
                    <div className="flex items-center text-sm text-orange-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {order.customer.phone}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="mb-4">
                    <div className="flex items-start text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <span className="font-medium text-gray-700">Delivery Address</span>
                        <p className="mt-1">{order.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  {order.instructions && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-start text-sm">
                        <svg className="w-4 h-4 mr-2 mt-0.5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <span className="font-medium text-yellow-800">Instructions</span>
                          <p className="text-yellow-700 mt-1">{order.instructions}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-700 mb-2">Order Items</h5>
                    <div className="space-y-1">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm text-gray-600">
                            <span>{item.productName || item.name}</span>
                            <span className="font-semibold">x{item.quantity}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">No items information available</div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Partner Info */}
                  <div className="mb-4 pb-4 border-b border-gray-100 bg-orange-50 rounded-lg p-3">
                    <h5 className="font-medium text-gray-700 mb-2">Delivery Partner:</h5>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-gray-700">{order.deliveryPartner?.name || 'Not assigned'}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-700">{order.deliveryPartner?.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showAddPartnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add Delivery Partner</h2>
              <button
                onClick={() => setShowAddPartnerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newPartner.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={newPartner.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={newPartner.phone}
                  onChange={handleInputChange}
                  pattern="[6-9]\d{9}"
                  title="Please enter a valid 10-digit phone number starting with 6-9"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="10-digit phone number (e.g., 9876543210)"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Format: 10 digits starting with 6-9</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={newPartner.password}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                <textarea
                  name="addressFull"
                  value={newPartner.addressFull}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="123 Main St, City, State ZIP"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apartment/Suite</label>
                <input
                  type="text"
                  name="addressApartment"
                  value={newPartner.addressApartment}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Apt 4B"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowAddPartnerModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPartner}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium"
                disabled={!newPartner.name || !newPartner.email || !newPartner.phone || !newPartner.password}
              >
                Add Partner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
