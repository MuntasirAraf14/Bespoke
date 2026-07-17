import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { backendURL, currency } from '../src/config';
import { toast } from 'react-toastify';

const statusColors = {
  'Order Placed':     'bg-blue-100 text-blue-700',
  'Packing':          'bg-yellow-100 text-yellow-700',
  'Shipped':          'bg-indigo-100 text-indigo-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  'Delivered':        'bg-green-100 text-green-700',
};

const StatCard = ({ title, value, icon, borderColor }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${borderColor} flex items-center justify-between`}>
    <div>
      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    <div className="text-4xl opacity-60">{icon}</div>
  </div>
);

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        axios.get(backendURL + '/api/product/list?limit=1'),
        axios.post(backendURL + '/api/order/list', {}, { headers: { token } }),
      ]);

      const totalProducts = productsRes.data?.pagination?.total ?? 0;
      const orders = ordersRes.data?.orders ?? [];

      const totalRevenue = orders
        .filter(o => o.payment)
        .reduce((sum, o) => sum + o.amount, 0);
      const pendingOrders = orders.filter(o => o.status === 'Order Placed').length;

      setStats({ totalProducts, totalOrders: orders.length, totalRevenue, pendingOrders });
      // Show 6 most recent
      setRecentOrders([...orders].reverse().slice(0, 6));
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Products"  value={stats.totalProducts}                              icon="🛍️" borderColor="border-blue-500" />
        <StatCard title="Total Orders"    value={stats.totalOrders}                                icon="📦" borderColor="border-purple-500" />
        <StatCard title="Revenue (Paid)"  value={`${currency}${stats.totalRevenue.toLocaleString()}`} icon="💰" borderColor="border-green-500" />
        <StatCard title="Pending Orders"  value={stats.pendingOrders}                              icon="⏳" borderColor="border-orange-500" />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>

        {recentOrders.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b text-gray-500 text-xs uppercase tracking-wide">
                  <th className="py-2 pr-4">Customer</th>
                  <th className="py-2 pr-4">Items</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Method</th>
                  <th className="py-2 pr-4">Payment</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4 font-medium text-gray-800">
                      {order.address?.firstName} {order.address?.lastName}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{order.items.length} item(s)</td>
                    <td className="py-3 pr-4 font-semibold">{currency}{order.amount}</td>
                    <td className="py-3 pr-4 text-gray-600">{order.paymentMethod}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.payment ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {order.payment ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
