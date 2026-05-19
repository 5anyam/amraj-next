'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';

interface Order {
  id: number;
  order_number: string;
  date_created: string;
  status: string;
  total: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
}

export default function MyAccountPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState<number | null>(null);
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const API_URL = 'https://cms.amraj.in/wp-json/amraj/v1'; // Change to your CMS URL

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': token!,
        },
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: number) => {
    setCancelLoading(orderId);
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': token!,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
    } finally {
      setCancelLoading(null);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">
                My Account
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, <span className="font-semibold text-teal-600">{user.name}</span></p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={logout}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-teal-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Your orders will appear here once you make a purchase.</p>
              <a
                href="/products"
                className="inline-block bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all"
              >
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Order #{order.order_number}</h3>
                      <p className="text-sm text-gray-500">{new Date(order.date_created).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                      <span className="text-2xl font-bold text-teal-600">₹{order.total}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-r from-teal-100 to-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-semibold text-teal-600">{item.name.split(' ')[0]}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">+{order.items.length - 3} more items</p>
                      </div>
                    )}
                  </div>

                  {order.status !== 'cancelled' && order.status !== 'completed' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      disabled={cancelLoading === order.id}
                      className="ml-auto px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center space-x-2"
                    >
                      {cancelLoading === order.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Cancelling...</span>
                        </>
                      ) : (
                        <span>Cancel Order</span>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
