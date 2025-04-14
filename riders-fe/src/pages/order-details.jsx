import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/api/axiosInstance';

export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [statusLoading, setStatusLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            setError('');
            
            const authToken = localStorage.getItem('authToken');
            
            if (!authToken) {
                setError('Authentication token not found. Please login again.');
                setLoading(false);
                return;
            }
            
            // Fetch order details
            const response = await axiosInstance.get(`/rider/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            
            setOrder(response.data.order);
            setSelectedStatus(response.data.order.status);
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError('Failed to load order details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Update order status
    const handleStatusUpdate = async () => {
        try {
            setStatusLoading(true);
            setError('');
            
            const authToken = localStorage.getItem('authToken');
            
            if (!authToken) {
                setError('Authentication token not found. Please login again.');
                setStatusLoading(false);
                return;
            }
            
            //api-call
            await axiosInstance.put(`/rider/orders/${order._id}/status`, {
                status: selectedStatus
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            
            // Show success message
            setSuccessMessage('Order status updated successfully!');
            
            // Refresh order details
            fetchOrderDetails();
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (err) {
            console.error('Error updating order status:', err);
            setError('Failed to update order status. Please try again later.');
        } finally {
            setStatusLoading(false);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="flex flex-col">
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-deep-navy rounded-full"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
                    <p>{error}</p>
                </div>
            ) : order ? (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-deep-navy">Order Details</h1>
                        <Link 
                            to="/rider" 
                            className="text-deep-navy hover:text-deep-navy flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </Link>
                    </div>

                    {successMessage && (
                        <div className="bg-green-100 text-green-800 px-4 py-3 rounded-md mb-6">
                            <p>{successMessage}</p>
                        </div>
                    )}

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-deep-navy">Order Summary</h2>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {/* Order details table */}
                            <div className="overflow-hidden border border-gray-200 rounded-md mb-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50 w-1/3">Order ID</td>
                                            <td className="px-4 py-3 text-sm">{order._id}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50 w-1/3">Customer</td>
                                            <td className="px-4 py-3 text-sm">{order.user_id.name}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">Order Date</td>
                                            <td className="px-4 py-3 text-sm">{formatDate(order.createdAt)}</td>
                                        </tr>
                                  
                                        <tr>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">Number of Items</td>
                                            <td className="px-4 py-3 text-sm">{order.items.length}</td>
                                        </tr>
                                        {order.user_id.address && (
                                            <>
                                                <tr>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">City</td>
                                                    <td className="px-4 py-3 text-sm">{order.user_id.address.city}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">Pincode</td>
                                                    <td className="px-4 py-3 text-sm">{order.user_id.address.pincode}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">Phone No.</td>
                                                    <td className="px-4 py-3 text-sm">{order.user_id.phone}</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Order Status Section */}
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Order Status</p>
                                <div className="flex items-center space-x-2">
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-mustard-yellow"
                                        disabled={statusLoading}
                                    >
                                       
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Undelivered">Undelivered</option>
                                    </select>
                                    
                                    <button
                                        onClick={handleStatusUpdate}
                                        disabled={statusLoading || selectedStatus === order.status}
                                        className={`px-4 py-2 rounded-md font-medium cursor-pointer ${statusLoading || selectedStatus === order.status ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-mustard-yellow text-deep-navy hover:bg-opacity-90 transition-colors'}`}
                                    >
                                        {statusLoading ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                                                <span>Updating...</span>
                                            </div>
                                        ) : 'Update Status'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </>
            ) : (
                <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-xl font-medium mb-2">Order Not Found</h3>
                    <p className="text-gray-600 mb-4">The order you're looking for doesn't exist or you don't have permission to view it.</p>
                    <Link 
                        to="/rider"
                        className="px-6 py-2 bg-mustard-yellow text-deep-navy font-semibold rounded-lg hover:bg-opacity-90 transition-colors inline-block"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            )}
        </div>
    );
}
