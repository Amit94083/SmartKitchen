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
          status: user.isActive !== false ? 'Active' : 'Inactive', // Default to active if not specified
          rating: user.rating || 4.5, // Default rating if not available
          totalDeliveries: user.totalDeliveries || 0,
          joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US'),
          currentLocation: user.addressFull || user.addressLabel || 'Location not set',
          addressFull: user.addressFull,
          addressLabel: user.addressLabel,
          userType: user.userType
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
      // Replace with actual API call
      setPartners(partners.map(partner => 
        partner.id === partnerId ? { ...partner, status: newStatus } : partner
      ));
    } catch (error) {
      console.error('Error updating partner status:', error);
    }
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
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
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

export default DeliveryPartners;