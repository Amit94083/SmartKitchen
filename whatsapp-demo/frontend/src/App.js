import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [counter, setCounter] = useState(10);
  const [messageStatus, setMessageStatus] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
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

  // Auto countdown effect
  useEffect(() => {
    let interval = null;
    if (isRunning && counter > 0 && !messageSent) {
      interval = setInterval(() => {
        setCounter(prevCounter => {
          const newCounter = prevCounter - 1;
          if (newCounter === 5) {
            // Trigger WhatsApp message when counter reaches 5
            sendWhatsAppMessage();
          }
          if (newCounter === 0) {
            setIsRunning(false);
          }
          return newCounter;
        });
      }, 1000); // Decrease every 1 second
    } else if (!isRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, counter, messageSent]);

  const startCounter = () => {
    setIsRunning(true);
    setMessageSent(false);
    setMessageStatus(null);
  };

  const stopCounter = () => {
    setIsRunning(false);
  };

  const resetCounter = () => {
    setCounter(10);
    setIsRunning(false);
    setMessageSent(false);
    setMessageStatus(null);
  };

  const decrementManually = () => {
    if (counter > 0) {
      const newCounter = counter - 1;
      setCounter(newCounter);
      if (newCounter === 5 && !messageSent) {
        sendWhatsAppMessage();
      }
      if (newCounter === 0) {
        setIsRunning(false);
      }
    }
  };

  return (
    <div className="container">
      <div className="counter-card">
        <div className="whatsapp-icon">📱</div>
        <h1 className="counter-title">WhatsApp Demo Counter</h1>
        
        <div 
          className={`counter-display ${counter <= 5 && counter > 0 ? 'warning' : ''}`}
          onClick={decrementManually}
          style={{ cursor: counter > 0 ? 'pointer' : 'default' }}
          title={counter > 0 ? 'Click to decrease counter' : 'Counter finished'}
        >
          {counter}
        </div>
        
        <p style={{ color: '#666', marginBottom: '20px' }}>
          {counter > 5 ? `WhatsApp message will be sent when counter reaches 5` : 
           counter === 5 ? `🔥 Sending WhatsApp message now!` :
           counter > 0 ? `Message already sent at 5!` :
           `Counter finished!`}
        </p>

        <div style={{ marginBottom: '20px' }}>
          <button 
            className="counter-button" 
            onClick={startCounter} 
            disabled={isRunning || counter === 0}
          >
            {isRunning ? 'Running...' : 'Start Auto Countdown'}
          </button>
          
          <button 
            className="counter-button" 
            onClick={stopCounter} 
            disabled={!isRunning}
          >
            Stop
          </button>
          
          <button 
            className="counter-button" 
            onClick={decrementManually} 
            disabled={isRunning || counter === 0}
          >
            -1 Manual
          </button>
          
          <button 
            className="counter-button" 
            onClick={resetCounter}
          >
            Reset
          </button>
        </div>

        {messageStatus && (
          <div className={`message-status ${messageStatus.type}`}>
            {messageStatus.type === 'sending' && <span className="loading-spinner"></span>}
            {messageStatus.message}
          </div>
        )}

        <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
          <p><strong>Target:</strong> +919104975168</p>
          <p><strong>Template:</strong> hello_world (en_US)</p>
          <p><strong>Trigger:</strong> When counter = 5</p>
        </div>
      </div>
    </div>
  );
};

export default App;