import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/api/axiosInstance';

export default function RiderDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchAssignedOrders();
    }, []);

    const fetchAssignedOrders = async () => {
        try {
            setLoading(true);
            setError('');
            
            const authToken = localStorage.getItem('authToken');
            
            if (!authToken) {
                setError('Authentication token not found. Please login again.');
                setLoading(false);
                return;
            }
            
            // API call to fetch assigned orders
            const response = await axiosInstance.get('/rider/orders', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            
            setOrders(response.data.orders);
        } catch (err) {
            console.error('Error fetching assigned orders:', err);
            setError('Failed to load orders. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Filter orders based on selected status
    const filteredOrders = statusFilter === 'All' 
        ? orders 
        : orders.filter(order => order.status === statusFilter);

    // Format date to a readable format
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-center text-center md:items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-deep-navy mb-2">Rider Dashboard</h1>
                    <p className="text-gray-600">View and manage your assigned orders here.</p>
                </div>
            </div>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
                    <p>{error}</p>
                </div>
            )}
            
            {/* Order Status Filter */}
            <div className="mb-6 flex justify-center text-center">
                <div>
                    <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">Filter by Order Status</label>
                    <div className="relative">
                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full text-center px-2 py-2 text-black border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-mustard-yellow appearance-none cursor-pointer"
                        >
                            <option value="All">All Orders</option>
                            <option value="Paid">Paid</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Undelivered">Undelivered</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {/* Orders List */}
            <div className="border-1 border-gray-400 rounded-md">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-deep-navy rounded-full"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-md shadow-sm p-8 text-center">
                        <p className="text-gray-600">No orders found with the selected status.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-md shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order._id.substring(order._id.length - 8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.user_id.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.items.length}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                                                ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                                                ${order.status === 'Paid' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${order.status === 'Undelivered' ? 'bg-red-100 text-red-800' : ''}
                                            `}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link 
                                                to={`/rider/orders/${order._id}`}
                                                className="px-3 py-1.5 bg-mustard-yellow text-deep-navy rounded-md hover:bg-opacity-90 transition-transform duration-300 hover:scale-105 cursor-pointer inline-block text-center"
                                            >
                                                View Details
                                            </Link>
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
}