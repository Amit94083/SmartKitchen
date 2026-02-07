import { useEffect, useRef } from 'react';

/**
 * Custom React hook for receiving real-time order updates via Server-Sent Events (SSE).
 * 
 * This hook establishes a persistent connection to the backend SSE endpoint
 * and automatically updates the orders state whenever an order status changes.
 * 
 * Features:
 * - Automatic connection on mount
 * - Auto-reconnection on errors (with 3-second delay)
 * - Clean disconnection on unmount
 * - Updates existing orders or appends new ones
 * 
 * @param {Function} setOrders - State setter function for the orders array
 * @param {boolean} enabled - Whether to enable SSE connection (default: true)
 * 
 * @example
 * const [orders, setOrders] = useState([]);
 * useOrderSSE(setOrders);
 */
const useOrderSSE = (setOrders, enabled = true) => {
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    // Don't connect if not enabled
    if (!enabled) {
      return;
    }

    /**
     * Establishes SSE connection to the backend
     */
    const connectSSE = () => {
      try {
        // Close existing connection if any
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        // Create new EventSource connection
        const eventSource = new EventSource('http://localhost:8080/api/orders/stream');
        eventSourceRef.current = eventSource;

        /**
         * Handle successful connection
         */
        eventSource.onopen = () => {
          console.log('✅ SSE Connection established - receiving real-time order updates');
          isConnectedRef.current = true;
        };

        /**
         * Handle incoming ORDER_UPDATED events
         */
        eventSource.addEventListener('ORDER_UPDATED', (event) => {
          try {
            // Parse the incoming order data
            const updatedOrder = JSON.parse(event.data);
            console.log('📦 Order update received:', updatedOrder);

            // Update orders state
            setOrders((prevOrders) => {
              // Check if order already exists in the list
              const existingIndex = prevOrders.findIndex(
                (order) => order.id === updatedOrder.id
              );

              if (existingIndex !== -1) {
                // Update existing order
                const newOrders = [...prevOrders];
                newOrders[existingIndex] = {
                  ...newOrders[existingIndex],
                  ...updatedOrder,
                };
                console.log('🔄 Updated existing order:', updatedOrder.id);
                return newOrders;
              } else {
                // Add new order to the list
                console.log('➕ Added new order to list:', updatedOrder.id);
                return [updatedOrder, ...prevOrders];
              }
            });
          } catch (error) {
            console.error('❌ Error parsing order update:', error);
          }
        });

        /**
         * Handle connection errors and implement auto-reconnect
         */
        eventSource.onerror = (error) => {
          console.error('❌ SSE Connection error:', error);
          isConnectedRef.current = false;

          // Close the current connection
          eventSource.close();

          // Attempt to reconnect after 3 seconds
          console.log('🔄 Reconnecting in 3 seconds...');
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('🔄 Attempting to reconnect...');
            connectSSE();
          }, 3000);
        };

      } catch (error) {
        console.error('❌ Error creating SSE connection:', error);
      }
    };

    // Establish initial connection
    connectSSE();

    /**
     * Cleanup function - closes connection and clears timeouts on unmount
     */
    return () => {
      console.log('🔌 Closing SSE connection');
      
      // Clear any pending reconnection attempts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      // Close the EventSource connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      isConnectedRef.current = false;
    };
  }, [setOrders, enabled]);

  // Return connection status for optional UI feedback
  return {
    isConnected: isConnectedRef.current
  };
};

export default useOrderSSE;
