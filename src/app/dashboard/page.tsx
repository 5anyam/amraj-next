"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Changed from 'next/router'
import Head from 'next/head';
import { WordPressAuth, WordPressUser } from '../../../lib/wordpress-auth';

interface OrderedProduct {
  id: number;
  name: string;
  quantity: number;
  price: number;
  order_date: string;
  status: string;
  image_url?: string;
  order_id: number;
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [orderedProducts, setOrderedProducts] = useState<OrderedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initDashboard = async () => {
      // Check if user is logged in
      if (!WordPressAuth.isLoggedIn()) {
        router.push('/login');
        return;
      }

      try {
        // Get user data
        const userData = WordPressAuth.getUser();
        if (!userData) {
          router.push('/login');
          return;
        }

        setUser(userData);

        // Validate token
        const isValid = await WordPressAuth.validateToken();
        if (!isValid) {
          WordPressAuth.logout();
          router.push('/login');
          return;
        }

        // Fetch user ordered products
        const userOrders = await WordPressAuth.getUserOrders();
        setOrderedProducts(userOrders);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [router]);

  const handleLogout = () => {
    WordPressAuth.logout();
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - WordPress Integration</title>
        <meta name="description" content="Your WordPress dashboard" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user?.display_name || user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
            {/* User Info Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Display Name</p>
                    <p className="text-lg text-gray-900">{user?.display_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Username</p>
                    <p className="text-lg text-gray-900">{user?.username}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <p className="text-lg text-gray-900">{orderedProducts.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Your Orders ({orderedProducts.length})
                </h3>
                
                {orderedProducts.length === 0 ? (
                  <p className="text-gray-500">No orders found.</p>
                ) : (
                  <div className="space-y-4">
                    {orderedProducts.map((product) => (
                      <div key={`${product.order_id}-${product.id}`} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-4">
                            {product.image_url && (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">
                                {product.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Order #{product.order_id}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : product.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : product.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Quantity</p>
                            <p className="text-lg text-gray-900">{product.quantity}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Price</p>
                            <p className="text-lg text-gray-900">${product.price.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Order Date</p>
                            <p className="text-lg text-gray-900">{formatDate(product.order_date)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;