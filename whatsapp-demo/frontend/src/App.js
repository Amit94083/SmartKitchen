import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [cartCount, setCartCount] = useState(0);
  const [messageStatus, setMessageStatus] = useState(null);
  const [messageSent, setMessageSent] = useState(false);

  // Function to send WhatsApp message
  const sendWhatsAppMessage = async () => {
    const payload = {
      to: "+919104975168",
      template: {
        name: "hello_world",
        language: {
          code: "en_US"
        }
      }
    };

    try {
      setMessageStatus({ type: 'sending', message: 'Sending WhatsApp message...' });
      const response = await axios.post('/whatsapp-api/api/v1/whatsapp/send-message', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data && response.data.success) {
        setMessageStatus({
          type: 'success',
          message: `✅ WhatsApp message sent successfully! Message ID: ${response.data.messageId || 'N/A'}`
        });
        setMessageSent(true);
      } else {
        setMessageStatus({
          type: 'error',
          message: `❌ Failed to send message: ${response.data.error || 'Unknown error'}`
        });
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      setMessageStatus({
        type: 'error',
        message: `❌ Error sending message: ${error.response?.data?.message || error.message || 'Network error'}`
      });
    }
  };

  // Add sandwich to cart
  const addToCart = () => {
    if (cartCount < 5) {
      const newCount = cartCount + 1;
      setCartCount(newCount);
      if (newCount === 5 && !messageSent) {
        sendWhatsAppMessage();
      }
    }
  };

  const resetCart = () => {
    setCartCount(0);
    setMessageSent(false);
    setMessageStatus(null);
  };

  return (
    <div className="container">
      <div className="counter-card">
        {messageSent ? (
          <div style={{ textAlign: 'center', fontSize: '2rem', color: '#667eea', margin: '60px 0' }}>
            Message sent
          </div>
        ) : (
          <>
            <div className="whatsapp-icon">🥪</div>
            <h1 className="counter-title">Sandwich Demo</h1>
            <div style={{ margin: '30px 0' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png" alt="Sandwich" style={{ width: 80, marginBottom: 10 }} />
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#764ba2' }}>Sandwich</div>
            </div>
            <div className="counter-display" style={{ fontSize: '3rem', marginBottom: 20 }}>
              Cart: {cartCount} / 5
            </div>
            <button 
              className="counter-button" 
              onClick={addToCart} 
              disabled={cartCount >= 5}
              style={{ marginRight: 10 }}
            >
              Add to Cart
            </button>
            <button 
              className="counter-button" 
              onClick={resetCart}
            >
              Reset Cart
            </button>
            <p style={{ color: '#666', margin: '20px 0' }}>
              {cartCount < 5 ? `Add sandwiches to cart. WhatsApp message will be sent when cart reaches 5.` : `🔥 Cart full! Sending WhatsApp message...`}
            </p>
            {messageStatus && (
              <div className={`message-status ${messageStatus.type}`}>
                {messageStatus.type === 'sending' && <span className="loading-spinner"></span>}
                {messageStatus.message}
              </div>
            )}
            <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
              <p><strong>Target:</strong> +919104975168</p>
              <p><strong>Template:</strong> hello_world (en_US)</p>
              <p><strong>Trigger:</strong> When cart = 5</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;