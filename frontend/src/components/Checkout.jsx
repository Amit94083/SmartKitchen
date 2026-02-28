import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, MapPin, Star, CheckCircle, Plus, Clock, CreditCard, Wallet, Wallet2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { userService, orderService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { imageMap } from "../assets/food";
import axios from "axios";

const DELIVERY_FEE = 40;

// Helper to get image src from imageMap or fallback
function getCartItemImage(item) {
  // Try menuItem.imageUrl, menuItem.image, then fallback to imageMap
  const imageKey = item.menuItem?.imageUrl || item.menuItem?.image || item.imageUrl || item.image;
  // If imageKey is a filename, use imageMap; if it's a URL, use directly
  if (!imageKey) return "";
  // If imageKey looks like a URL (starts with http), use directly
  if (typeof imageKey === "string" && imageKey.startsWith("http")) return imageKey;
  // If imageKey is a filename, use imageMap
  return imageMap[imageKey] || imageKey;
}

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, refreshUser } = useAuth();
  const [addresses, setAddresses] = useState([]); // Multiple addresses
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressLabel, setAddressLabel] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [apt, setApt] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [addressError, setAddressError] = useState(""); // Error state for address

  useEffect(() => {
    async function fetchAddresses() {
      if (user && user.id) {
        try {
          const response = await userService.getProfile(user.id); // Fetch user profile
          console.log('User profile response:', response);
          console.log('Auth user:', user);
          // Construct address object from profile fields
          const addressObj = {
            label: response.addressLabel,
            full: response.addressFull,
            apartment: response.addressApartment,
            instructions: response.addressInstructions,
            name: response.name || user.name,
          };
          setAddresses([addressObj]);
          setSelectedAddress(addressObj);
        } catch (err) {
          setAddresses([]);
          setSelectedAddress(null);
        }
      }
    }
    fetchAddresses();
  }, [user]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!user || !fullAddress) return;
    const profileData = {
      addressLabel: addressLabel,
      addressFull: fullAddress,
      addressApartment: apt,
      addressInstructions: deliveryInstructions,
    };
    try {
      const updatedUser = await userService.updateProfile(profileData);
      // Update local address state from updatedUser
      const addressObj = {
        label: updatedUser.addressLabel,
        full: updatedUser.addressFull,
        apartment: updatedUser.addressApartment,
        instructions: updatedUser.addressInstructions,
        name: updatedUser.name || user.name,
      };
      setAddresses([addressObj]);
      setSelectedAddress(addressObj);
      setShowAddressModal(false);
      setAddressLabel("");
      setFullAddress("");
      setApt("");
      setDeliveryInstructions("");
      // Refresh user context to update profile
      if (refreshUser) {
        await refreshUser();
      }
    } catch (err) {
      // handle error, e.g. show alert
      alert('Failed to save address');
    }
  };


  // Dummy address and payment data for UI
  const [paymentMethod, setPaymentMethod] = useState("card");
  const navigate = useNavigate();

  // Handler for Razorpay payment
  const handleRazorpayPayment = async () => {
    try {
      const totalWithDelivery = cartTotal + DELIVERY_FEE;
      const response = await axios.post(
        "http://localhost:8080/api/payment/create-order",
        { amount: totalWithDelivery }
      );

      // If response.data is a string, parse it; otherwise use it directly
      const order = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      const options = {
        key: "rzp_test_SJFnONl6nfTaU5",
        amount: order.amount,
        currency: "INR",
        name: "Smart Kitchen",
        description: "Food Order Payment",
        order_id: order.id,
        handler: function (response) {
          alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
          console.log(response);
          // After successful payment, place the order
          placeOrderAfterPayment();
        },
        theme: {
          color: "#f97316",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Failed to initialize payment");
    }
  };

  // Handler for placing order after payment
  const placeOrderAfterPayment = async () => {
    if (!user || !selectedAddress || !cart || !cart.items || cart.items.length === 0) {
      alert('Missing user, address, or cart data.');
      return;
    }
    const orderData = {
      userId: user.id,
      totalAmount: cartTotal + DELIVERY_FEE,
      addressLabel: selectedAddress.label || selectedAddress.name,
      addressFull: selectedAddress.full,
      addressApartment: selectedAddress.apartment,
      addressInstructions: selectedAddress.instructions,
      orderItems: cart.items.map(item => ({
        productName: item.menuItem?.name || item.name,
        quantity: item.quantity,
        price: item.menuItem?.price || item.price,
        menuItemId: item.menuItem?.itemId || item.id 
      })),
    };
    try {
      const order = await orderService.placeOrder(orderData);
      await clearCart();
      navigate(`/order/${order.id}`);
    } catch (err) {
      alert('Failed to place order.');
    }
  };

  // Handler for placing order
  const handlePlaceOrder = async () => {
    if (!user || !selectedAddress || !cart || !cart.items || cart.items.length === 0) {
      alert('Missing user, address, or cart data.');
      return;
    }
    // Address validation
    if (!selectedAddress.full || selectedAddress.full.trim() === "" || selectedAddress.full === "No Address") {
      setAddressError("Please provide a delivery address before placing your order.");
      return;
    } else {
      setAddressError("");
    }
    
    // If Digital Wallet is selected, open Razorpay
    if (paymentMethod === "wallet") {
      handleRazorpayPayment();
      return;
    }
    const orderData = {
      userId: user.id, // Add userId to the request
      totalAmount: cartTotal,
      addressLabel: selectedAddress.label || selectedAddress.name,
      addressFull: selectedAddress.full,
      addressApartment: selectedAddress.apartment,
      addressInstructions: selectedAddress.instructions,
      orderItems: cart.items.map(item => ({
        productName: item.menuItem?.name || item.name,
        quantity: item.quantity,
        price: item.menuItem?.price || item.price,
        menuItemId: item.menuItem?.itemId || item.id 
      })),
    };
    try {
      const order = await orderService.placeOrder(orderData);
      await clearCart();
      // Redirect to order status page with real order id
      navigate(`/order/${order.id}`);
    } catch (err) {
      alert('Failed to place order.');
    }
  };

  // Handle empty or not loaded cart
  if (!cart || !cart.items || cart.items.length === 0) {
    return <div className="text-center text-gray-500 py-20">Your cart is empty.</div>;
  }
  const items = cart.items;
  // Defensive fallback for cartTotal
  const safeCartTotal = typeof cartTotal === 'number' && !isNaN(cartTotal) ? cartTotal : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Address, Instructions, Payment */}
        <div className="md:col-span-2 flex flex-col gap-8">
          {/* Delivery Address */}
          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-orange-500 w-5 h-5" />
              <h2 className="font-semibold text-lg">Delivery Address</h2>
            </div>
            <div className="border-2 border-orange-400 bg-orange-50 rounded-xl p-4 flex items-center gap-4 mb-4">
              <div className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 flex items-center gap-1">{selectedAddress?.label || selectedAddress?.name || "No Name"} <Star className="w-4 h-4 text-orange-400" /></div>
                <div className="text-gray-500 text-sm">{selectedAddress?.full || "No Address"}</div>
                <div className="text-gray-400 text-xs">Apt: {selectedAddress?.apartment || "N/A"}</div>
              </div>
              <CheckCircle className="text-orange-500 w-6 h-6" />
            </div>
            {/* Address required message */}
            {(!selectedAddress || !selectedAddress.full || selectedAddress.full.trim() === "" || selectedAddress.full === "No Address") && (
              <div className="text-red-500 text-sm font-medium mb-2 text-center">Address is required for placing orders.</div>
            )}
            <button
              className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 text-gray-500 font-medium hover:bg-gray-50 transition"
              onClick={() => setShowAddressModal(true)}
            >
              <Plus className="w-5 h-5" /> Add New Address
            </button>

            {/* Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
                    onClick={() => setShowAddressModal(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h2 className="text-2xl font-semibold mb-6">Add Delivery Address</h2>
                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div>
                      <label className="block font-medium mb-1">Label (e.g., Home, Work)</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="Home"
                        value={addressLabel}
                        onChange={e => setAddressLabel(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Full Address</label>
                      <textarea
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="123 Main St, City, State ZIP"
                        value={fullAddress}
                        onChange={e => setFullAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Apartment/Suite (optional)</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="Apt 4B"
                        value={apt}
                        onChange={e => setApt(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Delivery Instructions (optional)</label>
                      <textarea
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="Ring doorbell twice, leave at door..."
                        value={deliveryInstructions}
                        onChange={e => setDeliveryInstructions(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-orange-200 hover:bg-orange-300 text-orange-900 font-semibold py-3 rounded-lg text-lg transition mt-2"
                    >
                      Save Address
                    </button>
                  </form>
                </div>
              </div>
            )}
          </section>

          {/* Delivery Instructions */}
          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-orange-500 w-5 h-5" />
              <h2 className="font-semibold text-lg">Delivery Instructions</h2>
            </div>
            <textarea className="w-full border border-gray-200 rounded-xl p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200" placeholder="Any special instructions for delivery..." rows={2} />
          </section>

          {/* Payment Method */}
          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="text-orange-500 w-5 h-5" />
              <h2 className="font-semibold text-lg">Payment Method</h2>
            </div>
            <div className="flex flex-col gap-4">
              <label className={`flex items-center gap-3 border-2 rounded-xl p-4 cursor-pointer transition ${paymentMethod === "card" ? "border-orange-400 bg-orange-50" : "border-gray-200"}`}>
                <input type="radio" name="payment" className="accent-orange-500" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                <CreditCard className="w-6 h-6 text-indigo-700" />
                <div>
                  <div className="font-semibold">Credit/Debit Card</div>
                  <div className="text-gray-400 text-sm">Pay securely with your card</div>
                </div>
              </label>
              <label className={`flex items-center gap-3 border-2 rounded-xl p-4 cursor-pointer transition ${paymentMethod === "wallet" ? "border-orange-400 bg-orange-50" : "border-gray-200"}`}>
                <input type="radio" name="payment" className="accent-orange-500" checked={paymentMethod === "wallet"} onChange={() => setPaymentMethod("wallet")} />
                <Wallet className="w-6 h-6 text-indigo-700" />
                <div>
                  <div className="font-semibold">Digital Wallet</div>
                  <div className="text-gray-400 text-sm">Apple Pay, Google Pay</div>
                </div>
              </label>
              <label className={`flex items-center gap-3 border-2 rounded-xl p-4 cursor-pointer transition ${paymentMethod === "cod" ? "border-orange-400 bg-orange-50" : "border-gray-200"}`}>
                <input type="radio" name="payment" className="accent-orange-500" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                <Wallet2 className="w-6 h-6 text-indigo-700" />
                <div>
                  <div className="font-semibold">Cash on Delivery</div>
                  <div className="text-gray-400 text-sm">Pay when you receive</div>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right: Order Summary */}
        <aside className="bg-white rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          {items.length > 0 && (
            <div className="space-y-4 mb-4">
              {items.map((item, idx) => (
                <div key={item.id || idx} className="flex items-center gap-3">
                  <img src={getCartItemImage(item)} alt={item.name || item.menuItem?.name} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{item.name || item.menuItem?.name}</div>
                    <div className="text-gray-400 text-sm">x{item.quantity}</div>
                  </div>
                  <div className="font-bold text-gray-900 text-lg">
                    ₹{
                      typeof item.price === 'number' && item.price > 0
                        ? item.price.toFixed(2)
                        : typeof item.menuItem?.price === 'number'
                          ? item.menuItem.price.toFixed(2)
                          : '0.00'
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>₹{safeCartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span>₹{DELIVERY_FEE.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span className="text-orange-500">₹{(safeCartTotal + DELIVERY_FEE).toFixed(2)}</span>
            </div>
            <button
              className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePlaceOrder}
              disabled={!selectedAddress || !selectedAddress.full || selectedAddress.full.trim() === "" || selectedAddress.full === "No Address"}
            >
              Place Order
            </button>
            {addressError && (
              <div className="text-red-500 text-center mt-2 font-semibold">{addressError}</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
