import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [menu, setMenu] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch menu and inventory on component mount
  useEffect(() => {
    fetchMenu();
    fetchInventory();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get('/whatsapp-api/api/v1/inventory/menu');
      setMenu(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await axios.get('/whatsapp-api/api/v1/inventory/current');
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  // Add item to cart
  const addToCart = (dishName) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.dishName === dishName);
      if (existingItem) {
        return prevCart.map(item =>
          item.dishName === dishName
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { dishName, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (dishName) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.dishName === dishName);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.dishName === dishName
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter(item => item.dishName !== dishName);
      }
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setOrderStatus(null);
  };

  // Place order
  const placeOrder = async () => {
    if (cart.length === 0) {
      setOrderStatus({ type: 'error', message: 'Cart is empty!' });
      return;
    }

    setLoading(true);
    try {
      const orderRequest = {
        items: cart.map(item => ({
          dishName: item.dishName,
          quantity: item.quantity
        }))
      };

      const response = await axios.post('/whatsapp-api/api/v1/inventory/order', orderRequest);
      
      if (response.data.success) {
        setOrderStatus({
          type: 'success',
          message: response.data.message,
          deductedIngredients: response.data.deductedIngredients
        });
        setCart([]);
        fetchInventory(); // Refresh inventory
      } else {
        setOrderStatus({
          type: 'error',
          message: response.data.error || 'Failed to process order'
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderStatus({
        type: 'error',
        message: error.response?.data?.error || 'Network error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  // Get cart total quantity
  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart item quantity
  const getCartItemQuantity = (dishName) => {
    const item = cart.find(item => item.dishName === dishName);
    return item ? item.quantity : 0;
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🍽️ Smart Kitchen - Inventory Management</h1>
        <div className="cart-summary">
          Cart: {getTotalQuantity()} items
          {cart.length > 0 && (
            <button onClick={clearCart} className="clear-cart-btn">
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {/* Menu Section */}
      <div className="menu-section">
        <h2>📋 Menu</h2>
        <div className="menu-grid">
          {menu.map((item) => (
            <div key={item.id} className="menu-item">
              <div className="menu-item-header">
                <h3>{item.dishName}</h3>
                <div className="price">₹{item.price}</div>
              </div>
              
              <div className="ingredients">
                <h4>Ingredients needed:</h4>
                <ul>
                  {item.breadSlices && <li>Bread Slices: {item.breadSlices}</li>}
                  {item.lettuce && <li>Lettuce: {item.lettuce}</li>}
                  {item.tomatoes && <li>Tomatoes: {item.tomatoes}</li>}
                  {item.onions && <li>Onions: {item.onions}</li>}
                  {item.cheeseSlices && <li>Cheese Slices: {item.cheeseSlices}</li>}
                  {item.mayonnaise && <li>Mayonnaise: {item.mayonnaise}</li>}
                  {item.alooTikki && <li>Aloo Tikki: {item.alooTikki}</li>}
                  {item.mintChutney && <li>Mint Chutney: {item.mintChutney}</li>}
                  {item.tamarindChutney && <li>Tamarind Chutney: {item.tamarindChutney}</li>}
                  {item.pickles && <li>Pickles: {item.pickles}</li>}
                  {item.butter && <li>Butter: {item.butter}</li>}
                </ul>
              </div>
              
              <div className="item-controls">
                <button 
                  onClick={() => removeFromCart(item.dishName)}
                  disabled={getCartItemQuantity(item.dishName) === 0}
                  className="control-btn"
                >
                  -
                </button>
                <span className="quantity">{getCartItemQuantity(item.dishName)}</span>
                <button 
                  onClick={() => addToCart(item.dishName)}
                  className="control-btn"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      {cart.length > 0 && (
        <div className="cart-section">
          <h2>🛒 Cart</h2>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.dishName} className="cart-item">
                <span>{item.dishName}</span>
                <span>Qty: {item.quantity}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={placeOrder}
            disabled={loading}
            className="place-order-btn"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      )}

      {/* Inventory Section */}
      {inventory && (
        <div className="inventory-section">
          <h2>📦 Current Inventory</h2>
          <div className="inventory-grid">
            <div className="inventory-item">
              <span>Bread Slices:</span>
              <span>{inventory.breadSlices}</span>
            </div>
            <div className="inventory-item">
              <span>Lettuce:</span>
              <span>{inventory.lettuce}</span>
            </div>
            <div className="inventory-item">
              <span>Tomatoes:</span>
              <span>{inventory.tomatoes}</span>
            </div>
            <div className="inventory-item">
              <span>Onions:</span>
              <span>{inventory.onions}</span>
            </div>
            <div className="inventory-item">
              <span>Cheese Slices:</span>
              <span>{inventory.cheeseSlices}</span>
            </div>
            <div className="inventory-item">
              <span>Mayonnaise:</span>
              <span>{inventory.mayonnaise}</span>
            </div>
            <div className="inventory-item">
              <span>Aloo Tikki:</span>
              <span>{inventory.alooTikki}</span>
            </div>
            <div className="inventory-item">
              <span>Mint Chutney:</span>
              <span>{inventory.mintChutney}</span>
            </div>
            <div className="inventory-item">
              <span>Tamarind Chutney:</span>
              <span>{inventory.tamarindChutney}</span>
            </div>
            <div className="inventory-item">
              <span>Pickles:</span>
              <span>{inventory.pickles}</span>
            </div>
            <div className="inventory-item">
              <span>Butter:</span>
              <span>{inventory.butter}</span>
            </div>
          </div>
        </div>
      )}

      {/* Order Status */}
      {orderStatus && (
        <div className={`order-status ${orderStatus.type}`}>
          <h3>{orderStatus.type === 'success' ? '✅ Order Successful!' : '❌ Order Failed'}</h3>
          <p>{orderStatus.message}</p>
          {orderStatus.deductedIngredients && (
            <div className="deducted-ingredients">
              <h4>Ingredients Deducted:</h4>
              <ul>
                {Object.entries(orderStatus.deductedIngredients).map(([ingredient, quantity]) => (
                  <li key={ingredient}>
                    {ingredient}: {quantity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;