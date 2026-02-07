import React, { useState, useEffect } from 'react';
import DeliverySidebar from './DeliverySidebar';
import { User, MapPin, Clock, Package, Search, ChevronDown } from 'lucide-react';
import { orderService, userService } from '../services/api';

const AssignOrders = () => {
  const [unassignedOrders, setUnassignedOrders] = useState([]);
  const [availablePartners, setAvailablePartners] = useState([]);
  const [allPartners, setAllPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const ordersData = await orderService.getAllOrders();
      
      const unassigned = ordersData.filter(order => {
        // Show all Ready orders (allows reassignment if needed)
        return order.status === 'Ready';
      });
      
      // Fetch available delivery partners (active ones)
      const partnersData = await userService.getDeliveryPartners();
      const activePartners = partnersData.filter(partner => partner.isActive !== false);
      
      // Find partners who are currently busy with other orders (Assigned or OnTheWay)
      const busyPartnerIds = ordersData
        .filter(order => 
          (order.status === 'Assigned' || order.status === 'OnTheWay') && 
          order.deliveryPartnerId
        )
        .map(order => order.deliveryPartnerId);
      
      // Filter out busy partners to show only available ones
      const availablePartners = activePartners.filter(partner => 
        !busyPartnerIds.includes(partner.id)
      );
      
      setUnassignedOrders(unassigned);
      setAllPartners(partnersData);
      setAvailablePartners(availablePartners);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignOrder = async (orderId, partnerId) => {
    if (!orderId || !partnerId) {
      return;
    }

    try {
      // Call the actual API to assign the order to the partner
      await orderService.assignDeliveryPartner(orderId, partnerId);
      
      // Find partner name for better user feedback
      const partner = availablePartners.find(p => p.id === parseInt(partnerId));
      const partnerName = partner ? partner.name : 'delivery partner';
      
      // Remove the assigned order from unassigned list
      setUnassignedOrders(prev => prev.filter(order => order.id !== orderId));
      
      // Close dropdown
      setOpenDropdown(null);

      
    } catch (error) {
      console.error('Error assigning order:', error);
      setError('Failed to assign order. Please try again.');
    }
  };

  const toggleDropdown = (orderId) => {
    setOpenDropdown(openDropdown === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DeliverySidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DeliverySidebar />
      
      <main className="flex-1 p-8 ml-64 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assign Orders</h1>
          <p className="text-gray-600">Assign delivery orders to available partners</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchData}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Ready Orders</h2>
            <div className="flex items-center gap-3">
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {unassignedOrders.length} orders
              </span>
              <button
                onClick={fetchData}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
          
          {/* Search Orders */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>
          
          {unassignedOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No ready orders found</h3>
              <p className="text-gray-500">Orders with "Ready" status will appear here for assignment or reassignment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {unassignedOrders
                .filter(order => {
                  const searchLower = searchQuery.toLowerCase();
                  const orderItems = order.orderItems?.map(item => 
                    (item.productName || item.menuItemName || '').toLowerCase()
                  ).join(' ') || '';
                  
                  return order.id.toString().includes(searchQuery) ||
                    order.customerName?.toLowerCase().includes(searchLower) ||
                    order.addressFull?.toLowerCase().includes(searchLower) ||
                    order.addressApartment?.toLowerCase().includes(searchLower) ||
                    orderItems.includes(searchLower);
                })
                .map(order => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900 text-lg">Order #{order.id}</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {order.status}
                        </span>
                        {order.deliveryPartnerId && (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                            Partner Assigned
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{order.customerName || 'Customer'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{[order.addressApartment, order.addressFull].filter(Boolean).join(', ') || 'Address not provided'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(order.orderTime || order.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <span className="font-semibold text-gray-900">Total: ₹{order.totalAmount}</span>
                        {order.orderItems && order.orderItems.length > 0 && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Items: </span>
                            {order.orderItems.map(item => item.productName || item.menuItemName).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Assignment Dropdown */}
                    <div className="relative ml-4">
                      <button
                        onClick={() => toggleDropdown(order.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        {order.deliveryPartnerId ? 'Reassign Partner' : 'Assign to Partner'}
                        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === order.id ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {openDropdown === order.id && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                          {availablePartners.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              No available partners
                              <div className="text-xs mt-1">All active partners are currently busy</div>
                            </div>
                          ) : (
                            <div className="py-2">
                              {/* Show currently assigned partner first if exists */}
                              {order.deliveryPartnerId && (
                                (() => {
                                  const currentPartner = availablePartners.find(p => p.id === order.deliveryPartnerId) ||
                                    allPartners.find(p => p.id === order.deliveryPartnerId);
                                  return currentPartner ? (
                                    <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
                                      <div className="text-xs text-blue-600 font-medium mb-1">Currently Assigned:</div>
                                      <div className="font-medium text-blue-900">{currentPartner.name}</div>
                                      <div className="text-sm text-blue-700">{currentPartner.phone}</div>
                                    </div>
                                  ) : null;
                                })()
                              )}
                              
                              {/* Available partners */}
                              {availablePartners.filter(p => p.id !== order.deliveryPartnerId).map(partner => (
                                <button
                                  key={partner.id}
                                  onClick={() => handleAssignOrder(order.id, partner.id)}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">{partner.name}</div>
                                      <div className="text-sm text-gray-600">{partner.phone}</div>
                                      <div className="text-xs text-gray-500">{partner.addressFull || 'No address'}</div>
                                    </div>
                                    <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                      Available
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AssignOrders;