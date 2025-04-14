import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/api';

export default function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError('');
                
                const authToken = localStorage.getItem('authToken');
                
                if (!authToken) {
                    setError('Authentication token not found. Please login again.');
                    setLoading(false);
                    return;
                }
                
                // api-call to fetch all orders
                const response = await axiosInstance.get('/admin/orders', {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                
                setOrders(response.data.orders);
                setFilteredOrders(response.data.orders);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrders();
    }, []);

    // Filter orders based on selected status
    useEffect(() => {
        if (statusFilter === 'All') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === statusFilter));
        }
    }, [statusFilter, orders]);

    // Format date to a readable format
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-center text-center md:items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-deep-navy mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome to the E-Store admin panel. Here you can view and manage orders, assign them to riders, and track delivery status.</p>
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
                        className="w-full text-center px-2 py-2  text-black border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-mustard-yellow appearance-none cursor-pointer"
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
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-deep-navy rounded-full"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
                        <p className="text-gray-600">There are no orders with the selected status.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-300">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900  uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900  uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900  uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900  uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900  uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900  uppercase tracking-wider">
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
                                                to={`/admin/orders/${order._id}`}
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