import { useState, useEffect } from 'react';
import axiosInstance from '../utils/api';

export default function OrderSummaryforAdmin({ order, onSuccess }) {
    const [selectedStatus, setSelectedStatus] = useState('');
    const [statusLoading, setStatusLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (order && order.status) {
            setSelectedStatus(order.status);
        }
    }, [order]);

    //update-status
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
            
            // api-call
            await axiosInstance.put(`/admin/orders/${order._id}/status`, {
                status: selectedStatus
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            
            // sucuess state
            onSuccess('Order status updated successfully!');
        } catch (err) {
            console.error('Error updating order status:', err);
            setError('Failed to update order status. Please try again later.');
        } finally {
            setStatusLoading(false);
        }
    };

    // fFormat date to a readable format
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (!order) return null;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex-1">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-deep-navy">Order Summary</h2>
                
            </div>
            
            <div className="p-6 space-y-4">
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                        <p>{error}</p>
                    </div>
                )}
                
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
                                <td className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">Total Amount</td>
                                <td className="px-4 py-3 text-sm font-medium">₹{order.total_price.toLocaleString()}</td>
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
                            <option value="Paid">Paid</option>
                            <option value="Shipped">Shipped</option>
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
    );
}