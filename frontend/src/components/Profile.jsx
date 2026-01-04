import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Box, User, MapPin, Star, Plus, CreditCard, Headset, LogOut } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "",
    fullAddress: "",
    apartment: "",
    instructions: ""
  });

  const handleInputChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    // Save logic here
    setShowAddressModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header Bar (reuse if you have a layout/header component) */}
      <div className="w-full flex items-center justify-between px-10 py-3 bg-gradient-to-b from-orange-100 to-white shadow-md h-[80px]">
        <div className="flex items-center gap-3">
          <div className="bg-orange-400 text-white font-bold rounded-full w-11 h-11 flex items-center justify-center text-lg">CK</div>
          <span className="text-xl font-bold text-gray-800 ml-2">CloudKitchen</span>
        </div>
        <nav className="flex items-center gap-7">
          <button
            className={`flex items-center gap-2 font-semibold text-base rounded-xl px-4 py-1.5 transition-colors duration-150
              ${location.pathname.startsWith('/restaurant')
                ? 'bg-[#ff9800] text-white'
                : 'bg-orange-100 text-orange-600'}
            `}
            onClick={() => navigate('/restaurant/1')}
            style={location.pathname === '/profile' ? { background: '#fff', color: '#f57c00' } : {}}
          >
            <Home className="w-5 h-5" /> Menu
          </button>
          <button className="flex items-center gap-2 text-gray-700 font-semibold text-base hover:bg-gray-100 rounded-xl px-4 py-1.5">
            <Box className="w-5 h-5" /> Orders
          </button>
          <button
            className={`flex items-center gap-2 font-semibold text-base rounded-xl px-4 py-1.5 transition-colors duration-150
              ${location.pathname === '/profile'
                ? 'bg-[#ff9800] text-white'
                : 'bg-orange-100 text-orange-600'}
            `}
            onClick={() => navigate('/profile')}
          >
            <User className="w-5 h-5" /> Profile
          </button>
        </nav>
      </div>

      {/* Orange Bar */}
      <div className="w-full h-20 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500" />

      {/* Profile Card */}
      <div className="flex flex-col items-center mt-[-40px]">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl flex items-center gap-6">
          <div className="bg-orange-100 text-orange-500 font-bold rounded-full w-20 h-20 flex items-center justify-center text-4xl">
            I
          </div>
          <div>
            <div className="text-2xl font-semibold text-gray-800 mb-1">IT015_Amit_Chaudhary</div>
            <div className="text-gray-500 text-lg">23ituoz016@ddu.ac.in</div>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-orange-600">
              <MapPin className="w-5 h-5 text-orange-600" /> Saved Addresses
            </div>
            <button
              className="flex items-center gap-1 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-orange-600"
              onClick={() => setShowAddressModal(true)}
            >
              <Plus className="w-4 h-4" /> Add
            </button>
                {/* Add Address Modal */}
                {showAddressModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
                      <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                        onClick={() => setShowAddressModal(false)}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      <h2 className="text-2xl font-semibold mb-6">Add Address</h2>
                      <form onSubmit={handleSaveAddress}>
                        <div className="mb-4">
                          <label className="block font-medium mb-1">Label</label>
                          <input
                            name="label"
                            value={addressForm.label}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            placeholder="Home, Work, etc."
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block font-medium mb-1">Full Address</label>
                          <textarea
                            name="fullAddress"
                            value={addressForm.fullAddress}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            placeholder="123 Main St, City, State ZIP"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block font-medium mb-1">Apartment/Suite</label>
                          <input
                            name="apartment"
                            value={addressForm.apartment}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            placeholder="Apt 4B"
                          />
                        </div>
                        <div className="mb-6">
                          <label className="block font-medium mb-1">Delivery Instructions</label>
                          <textarea
                            name="instructions"
                            value={addressForm.instructions}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            placeholder="Ring doorbell, leave at door..."
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-orange-400 text-white font-semibold py-3 rounded-lg transition hover:bg-orange-500 disabled:opacity-60"
                          style={{ background: addressForm.label && addressForm.fullAddress ? '#ffa726' : '#ffe0b2' }}
                          disabled={!addressForm.label || !addressForm.fullAddress}
                        >
                          Save Address
                        </button>
                      </form>
                    </div>
                  </div>
                )}
          </div>
          <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg mb-2">
            <MapPin className="w-5 h-5 text-orange-400" />
            <div>
              <div className="font-semibold text-gray-800 flex items-center gap-1">Amit <Star className="w-4 h-4 text-orange-500 inline" fill="#f59e42" /></div>
              <div className="text-gray-500 text-sm">cfkdk</div>
              <div className="text-gray-400 text-xs">Apt: nfk</div>
            </div>
          </div>
        </div>

        {/* Payment Methods & Support */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mt-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <span className="font-semibold text-gray-800">Payment Methods</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Headset className="w-5 h-5 text-gray-400" />
            <span className="font-semibold text-gray-800">Contact Support</span>
          </div>
        </div>

        {/* Sign Out */}
        <button className="flex items-center gap-2 border border-orange-300 text-orange-500 font-semibold rounded-xl px-8 py-3 mt-8 hover:bg-orange-50">
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </div>
  );
}
