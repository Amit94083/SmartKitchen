import React, { useState, useEffect } from 'react';
import DeliverySidebar from './DeliverySidebar';
import { User, Phone, MapPin, Star, Check, X, Search } from 'lucide-react';
import { userService } from '../services/api';

const DeliveryPartners = () => {
  const [partners, setPartners] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Fetch delivery partners from backend
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const data = await userService.getDeliveryPartners();
        // Transform the user data to match component expectations
        const transformedPartners = data.map(user => ({
          id: user.id,
          name: user.name || 'Unknown',
          phone: user.phone || 'Not provided',
          email: user.email || 'Not provided',
          status: user.isActive !== false ? 'Active' : 'Inactive', 
          rating: user.rating || 4.5, 
          totalDeliveries: user.totalDeliveries || 0,
          joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US'),
          // Properly format address combining both fields
          currentLocation: [user.addressApartment, user.addressFull]
            .filter(field => field && field.trim()) 
            .join(', ') || 'Address not provided',
          addressFull: user.addressFull,
          addressApartment: user.addressApartment,
          addressLabel: user.addressLabel,
          userType: user.userType,
          isActive: user.isActive 
        }));
        setPartners(transformedPartners);
        setError(null);
      } catch (error) {
        console.error('Error fetching delivery partners:', error);
        setError('Failed to load delivery partners. Please try again.');
        setPartners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         partner.phone.includes(searchQuery) ||
                         partner.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'All' || partner.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleStatusUpdate = async (partnerId, newStatus) => {
    try {
      const isActive = newStatus === 'Active';
      await userService.updateUserStatus(partnerId, isActive);
      
      // Update local state
      setPartners(partners.map(partner => 
        partner.id === partnerId ? { ...partner, status: newStatus, isActive: isActive } : partner
      ));
    } catch (error) {
      console.error('Error updating partner status:', error);
      // Optionally show error message to user
      setError('Failed to update partner status. Please try again.');
    }
  };

  const handleViewDetails = (partner) => {
    setSelectedPartner(partner);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedPartner(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DeliverySidebar />
      
      <main className="flex-1 p-8 ml-64 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Partners</h1>
          <p className="text-gray-600">Manage and monitor delivery team members</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            {['All', 'Active', 'Inactive'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Partners Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading delivery partners...</div>
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
        ) : filteredPartners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No delivery partners found</p>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map(partner => (
              <div key={partner.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                {/* Partner Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{partner.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{partner.rating}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    partner.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {partner.status}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{partner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{partner.currentLocation}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Deliveries</span>
                    <span className="font-semibold text-gray-800">{partner.totalDeliveries}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">Join Date</span>
                    <span className="text-sm text-gray-800">{new Date(partner.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {partner.status === 'Active' ? (
                    <button
                      onClick={() => handleStatusUpdate(partner.id, 'Inactive')}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusUpdate(partner.id, 'Active')}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Activate
                    </button>
                  )}
                  <button 
                    onClick={() => handleViewDetails(partner)}
                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Details Modal */}
      {showDetailsModal && selectedPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Delivery Partner Details</h2>
              <button
                onClick={closeDetailsModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              {/* Partner Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedPartner.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedPartner.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {selectedPartner.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{selectedPartner.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{selectedPartner.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a1 1 0 001.42 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-700">{selectedPartner.email}</span>
                    </div>
                  </div>
                </div>
                
                {/* Address Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Address Information</h4>
                  <div className="space-y-2">
                    {selectedPartner.addressLabel && (
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Label</span>
                        <p className="text-sm text-gray-700">{selectedPartner.addressLabel}</p>
                      </div>
                    )}
                    {selectedPartner.addressApartment && (
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Apartment/Unit</span>
                        <p className="text-sm text-gray-700">{selectedPartner.addressApartment}</p>
                      </div>
                    )}
                    {selectedPartner.addressFull && (
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Full Address</span>
                        <p className="text-sm text-gray-700">{selectedPartner.addressFull}</p>
                      </div>
                    )}
                    {!selectedPartner.addressLabel && !selectedPartner.addressApartment && !selectedPartner.addressFull && (
                      <p className="text-sm text-gray-500">No address information provided</p>
                    )}
                  </div>
                </div>
                
                {/* Performance Stats */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Deliveries</span>
                      <span className="font-medium text-gray-900">{selectedPartner.totalDeliveries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium text-gray-900">{selectedPartner.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Account Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Account Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">User ID</span>
                      <span className="font-medium text-gray-900">#{selectedPartner.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">User Type</span>
                      <span className="font-medium text-gray-900">{selectedPartner.userType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Join Date</span>
                      <span className="font-medium text-gray-900">{selectedPartner.joinDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedPartner.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {selectedPartner.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                {selectedPartner.status === 'Active' ? (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedPartner.id, 'Inactive');
                      closeDetailsModal();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Deactivate Partner
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedPartner.id, 'Active');
                      closeDetailsModal();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Activate Partner
                  </button>
                )}
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPartners;