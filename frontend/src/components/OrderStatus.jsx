
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, MapPin, DollarSign } from "lucide-react";
import { orderService } from "../services/api";
import { imageMap } from "../assets/food/index";
import useOrderSSE from "../hooks/useOrderSSE";

const ORDER_STEPS = [
  { label: "Placed", key: "Placed", icon: <Clock className="w-6 h-6" /> },
  { label: "Confirmed", key: "Confirmed", icon: <span className="w-6 h-6 flex items-center justify-center">✔️</span> },
  { label: "Preparing", key: "Preparing", icon: <span className="w-6 h-6 flex items-center justify-center">🥣</span> },
  { label: "Ready", key: "Ready", icon: <span className="w-6 h-6 flex items-center justify-center">📦</span> },
  { label: "Assigned", key: "Assigned", icon: <span className="w-6 h-6 flex items-center justify-center">🎯</span> },
  { label: "On the Way", key: "OnTheWay", icon: <span className="w-6 h-6 flex items-center justify-center">🚴‍♂️</span> },
  { label: "Delivered", key: "Delivered", icon: <span className="w-6 h-6 flex items-center justify-center">🏠</span> },
];

export default function OrderStatus() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  
  // Enable real-time order updates via SSE
  useOrderSSE(setAllOrders);
  
  // When allOrders updates via SSE, check if our order is in there
  useEffect(() => {
    const updatedOrder = allOrders.find(o => o.id === parseInt(orderId));
    if (updatedOrder) {
      setOrder(updatedOrder);
      console.log('📦 Order status updated in real-time:', updatedOrder.status);
    }
  }, [allOrders, orderId]);
  
  const getDisplayStatus = (status) => {
    return status === "Pending" ? "Placed" : status;
  };

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await orderService.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setOrder(null);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (!order) return <div>Loading...</div>;

  const displayStatus = getDisplayStatus(order.status);
  const currentStep = ORDER_STEPS.findIndex(s => s.key === displayStatus);

  // Calculate estimated delivery time
  const getEstimatedDelivery = () => {
    // If delivered, show actual delivery time
    if (displayStatus === 'Delivered' && order.deliveredAt) {
      return {
        status: 'Delivered',
        time: new Date(order.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullTime: new Date(order.deliveredAt).toLocaleString()
      };
    }
    
    // If cancelled
    if (displayStatus === 'Cancelled') {
      return {
        status: 'Cancelled',
        time: 'Order Cancelled',
        fullTime: null
      };
    }
    
    // For orders in progress, calculate estimated time
    if (order.orderTime) {
      const orderDate = new Date(order.orderTime);
      // Estimated delivery: 45 minutes from order time
      const estimatedTime = new Date(orderDate.getTime() + 45 * 60000);
      
      const now = new Date();
      const minutesRemaining = Math.max(0, Math.round((estimatedTime - now) / 60000));
      
      return {
        status: 'InProgress',
        time: estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullTime: estimatedTime.toLocaleString(),
        minutesRemaining: minutesRemaining
      };
    }
    
    return {
      status: 'Unknown',
      time: '-',
      fullTime: null
    };
  };

  const estimatedDelivery = getEstimatedDelivery();

  // Calculate subtotal from order items
  const subtotal = order.orderItems
    ? order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : 0;
  // Use deliveryFee if present, else fallback to 40
  const deliveryFee = order.deliveryFee !== undefined && order.deliveryFee !== null ? order.deliveryFee : 40;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2 relative">
          <button onClick={() => navigate('/customer/orders')} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&#8592;</button>
          <div>
            <div className="font-semibold text-lg">Order #{order.id}</div>
            <div className="text-gray-400 text-sm">
              {displayStatus === 'Delivered' && order.deliveredAt ? (
                <span>
                  <span className="text-green-600 font-medium">Delivered:</span> {new Date(order.deliveredAt).toLocaleString()}
                </span>
              ) : (
                order.orderTime ? new Date(order.orderTime).toLocaleString() : ""
              )}
            </div>
          </div>
          <span className="ml-auto bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold capitalize">{displayStatus}</span>
        </div>
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow p-6 mt-4">
          <h2 className="text-2xl font-bold text-center mb-1">Order in Progress</h2>
          <p className="text-center text-gray-500 mb-6">Your order has been received and is being processed.</p>
          {/* Progress Tracker */}
          <div className="flex items-center justify-between mb-8">
            {ORDER_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStep || (idx === currentStep && displayStatus === 'Delivered');
              const isCurrent = idx === currentStep && displayStatus !== 'Delivered';
              const isActive = isCompleted || isCurrent;
              
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 border-2 ${
                    isCompleted 
                      ? 'border-green-500 bg-green-500' 
                      : isCurrent 
                        ? 'border-orange-500 bg-orange-100' 
                        : 'border-gray-200 bg-gray-50'
                  }`}>
                    {isCompleted ? (
                      <span className="text-white text-sm">✓</span>
                    ) : isCurrent ? (
                      <Clock className="w-6 h-6 text-orange-500" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className={`text-xs ${isActive ? 'text-orange-500 font-semibold' : 'text-gray-400'}`}>{step.label}</div>
                  {idx < ORDER_STEPS.length - 1 && (
                    <div className={`absolute top-5 right-0 w-full h-0.5 z-0 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} style={{ left: '50%', right: '-50%' }}></div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Estimated Delivery */}
          <div className={`rounded-xl p-4 flex items-center gap-3 mb-8 ${
            estimatedDelivery.status === 'Cancelled' ? 'bg-red-50' : 'bg-orange-50'
          }`}>
            <Clock className={`w-6 h-6 ${
              estimatedDelivery.status === 'Cancelled' ? 'text-red-500' : 'text-orange-500'
            }`} />
            <div className="flex-1">
              <div className={`text-xs mb-1 ${
                estimatedDelivery.status === 'Delivered' ? 'text-orange-600 font-semibold' : 'text-gray-500'
              }`}>
                {estimatedDelivery.status === 'Delivered' ? 'Delivered At' : 'Estimated Delivery'}
              </div>
              <div className={`font-bold text-xl ${
                estimatedDelivery.status === 'Cancelled' ? 'text-red-600' : 'text-orange-600'
              }`}>
                {estimatedDelivery.time}
              </div>
              {estimatedDelivery.status === 'InProgress' && estimatedDelivery.minutesRemaining > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  (in approximately {estimatedDelivery.minutesRemaining} minutes)
                </div>
              )}
              {estimatedDelivery.status === 'InProgress' && estimatedDelivery.minutesRemaining === 0 && (
                <div className="text-xs text-green-600 mt-1 font-semibold">
                  Arriving soon!
                </div>
              )}
            </div>
          </div>
          {/* Delivery Address */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="font-semibold mb-1 flex items-center gap-2">
              <MapPin className="text-gray-400 w-5 h-5" /> Delivery Address
            </div>
            <div>{order.addressFull}</div>
            <div className="text-xs text-gray-400 italic mt-1">Apt: {order.addressApartment} | Note: {order.addressInstructions}</div>
          </div>
          {/* Order Items & Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mt-4">
             <div className="font-semibold mb-3 text-base">
               Order Items
             </div>
            {order.orderItems && order.orderItems.map((item, idx) => {
              const baseName = item.productName ? item.productName.replace(/\s/g, "") : "";
              const lowerBase = baseName.toLowerCase();
              const candidates = [
                item.image,
                item.productImage,
                baseName + ".jpg",
                baseName + ".jpeg",
                baseName + "Pizza.jpg",
                baseName + "Pizza.jpeg",
                lowerBase + ".jpg",
                lowerBase + ".jpeg",
                lowerBase + "pizza.jpg",
                lowerBase + "pizza.jpeg",
                "MexicanDelightPizza.jpg",
                "MexicanDelight.jpg"
              ].filter(Boolean);
              let imgSrc = null;
              for (const key of candidates) {
                if (imageMap[key]) {
                  imgSrc = imageMap[key];
                  break;
                }
                const foundKey = Object.keys(imageMap).find(k => k.toLowerCase() === key.toLowerCase());
                if (foundKey) {
                  imgSrc = imageMap[foundKey];
                  break;
                }
              }
              return (
                <div key={idx} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                  {imgSrc ? (
                    <img src={imgSrc} alt={item.productName} className="w-12 h-12 rounded object-cover border" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center border" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-xs text-gray-400">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-semibold">₹{item.price}</div>
                </div>
              );
            })}
            <hr className="my-3" />
            <div className="flex justify-between text-gray-700 mb-1">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-1">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span className="text-orange-500">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
