import React, { useState, useEffect } from 'react';
import DeliverySidebar from './DeliverySidebar';
import { useAuth } from '../context/AuthContext';

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [status, setStatus] = useState('BUSY');
  const [stats, setStats] = useState({
    activeOrders: 3,
    todaysDeliveries: 4,
    totalDeliveries: 4,
    avgDeliveryTime: 28
  });

  const [orders, setOrders] = useState([
    {
      id: 'ORD-005',
      status: 'assigned',
      statusLabel: 'Assigned',
      assignedTime: '10 minutes ago',
      amount: 365,
      customer: {
        name: 'Vikram Singh',
        phone: '+91 54321 09876'
      },
      address: '42, MG Road, Sector 5, Gurugram, Haryana 122001',
      instructions: 'Call before arriving. Gate code: 1234',
      items: [
        { name: 'Kadhai Paneer', quantity: 1 },
        { name: 'Garlic Naan', quantity: 3 }
      ]
    },
    {
      id: 'ORD-006',
      status: 'picked-up',
      statusLabel: 'Picked Up',
      assignedTime: '25 minutes ago',
      amount: 280,
      customer: {
        name: 'Meera Iyer',
        phone: '+91 43210 98765'
      },
      address: '15, Anna Nagar, Chennai, Tamil Nadu 600040',
      instructions: null,
      items: [
        { name: 'Masala Dosa', quantity: 2 },
        { name: 'Filter Coffee', quantity: 2 }
      ]
    },
    {
      id: 'ORD-015',
      status: 'on-the-way',
      statusLabel: 'On The Way',
      assignedTime: '35 minutes ago',
      amount: 320,
      customer: {
        name: 'Anita Desai',
        phone: '+91 87654 12309'
      },
      address: '78, Koramangala 4th Block, Bangalore 560034',
      instructions: 'Leave at reception desk',
      items: [
        { name: 'Biryani', quantity: 1 },
        { name: 'Raita', quantity: 1 }
      ]
    }
  ]);

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
        label: 'Picked Up',
        icon: '📦',
        color: 'bg-orange-500 hover:bg-orange-600',
        nextStatus: 'picked-up'
      },
      'picked-up': {
        label: 'On The Way',
        icon: '🚗',
        color: 'bg-blue-500 hover:bg-blue-600',
        nextStatus: 'on-the-way'
      },
      'on-the-way': {
        label: 'Delivered',
        icon: '✓',
        color: 'bg-green-500 hover:bg-green-600',
        nextStatus: 'delivered'
      }
    };
    return configs[status];
  };

  const handleStatusChange = (orderId, currentStatus) => {
    const buttonConfig = getButtonConfig(currentStatus);
    if (buttonConfig) {
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
    }
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
                  Welcome, {user?.name || 'Raju Kumar'}
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
              {/* Online Toggle */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 font-medium">🟢 Online</span>
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isOnline ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isOnline ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Notification Bell */}
              <button className="relative">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                  1
                </span>
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

        {/* Assigned Orders */}
        <div className="px-8 pb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Assigned Orders</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.filter(order => order.status !== 'delivered').map((order) => {
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
                    Assigned {order.assignedTime}
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
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm text-gray-600">
                          <span>{item.name}</span>
                          <span className="font-semibold">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  {buttonConfig && (
                    <button
                      onClick={() => handleStatusChange(order.id, order.status)}
                      className={`w-full ${buttonConfig.color} text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors`}
                    >
                      <span>{buttonConfig.icon}</span>
                      <span>{buttonConfig.label}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
