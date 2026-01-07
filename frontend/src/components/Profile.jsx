import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/api";
import { useLocation } from "react-router-dom";
import { MapPin, Star, Plus, CreditCard, Headset, LogOut } from "lucide-react";
import AppHeader from "./AppHeader";

export default function Profile() {
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "",
    fullAddress: "",
    apartment: "",
    instructions: ""
  });

  // Open modal and pre-fill form if updating
  const handleOpenAddressModal = () => {
    if (user?.addressLabel) {
      setAddressForm({
        label: user.addressLabel || "",
        fullAddress: user.addressFull || "",
        apartment: user.addressApartment || "",
        instructions: user.addressInstructions || ""
      });
    } else {
      setAddressForm({ label: "", fullAddress: "", apartment: "", instructions: "" });
    }
    setShowAddressModal(true);
  };

  const handleInputChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const profileData = {
        addressLabel: addressForm.label,
        addressFull: addressForm.fullAddress,
        addressApartment: addressForm.apartment,
        addressInstructions: addressForm.instructions,
      };
      const updatedUser = await userService.updateProfile(profileData);
      // Update user context (login expects token and user)
      login(localStorage.getItem('token'), updatedUser);
    } catch (err) {
      alert('Failed to save address');
    }
    setShowAddressModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AppHeader />
      {/* Orange Gradient Background (match restaurant/hero style) */}
      <div className="w-full h-20 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 mt-[80px]" />
      {/* Profile Card */}
      <div className="flex flex-col items-center mt-[-40px]">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl flex items-center gap-6">
          <div className="bg-orange-100 text-orange-500 font-bold rounded-full w-20 h-20 flex items-center justify-center text-4xl">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="text-2xl font-semibold text-gray-800 mb-1">{user?.name || "Unknown User"}</div>
            <div className="text-gray-500 text-lg">{user?.email || "No email"}</div>
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
              onClick={handleOpenAddressModal}
            >
              <Plus className="w-4 h-4" /> {user?.addressLabel ? 'Update' : 'Add'}
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
                          {user?.addressLabel ? 'Update Address' : 'Save Address'}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
          </div>
          {/* Render user's address if available */}
          {user?.addressLabel && (
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg mb-2">
              <MapPin className="w-5 h-5 text-orange-400" />
              <div>
                <div className="font-semibold text-gray-800 flex items-center gap-1">{user.addressLabel} <Star className="w-4 h-4 text-orange-500 inline" fill="#f59e42" /></div>
                <div className="text-gray-500 text-sm">{user.addressFull}</div>
                {user.addressApartment && <div className="text-gray-400 text-xs">Apt: {user.addressApartment}</div>}
              </div>
            </div>
          )}
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
        <button
          className="flex items-center gap-2 border border-orange-300 text-orange-500 font-semibold rounded-xl px-8 py-3 mt-8 hover:bg-orange-50"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </div>
  );
}
