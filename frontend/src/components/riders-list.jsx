import { useEffect, useState } from 'react';
import axiosInstance from "../utils/api";

export default function RidersList({ order, onSuccess }) {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // fetch riders on component mounts or order changes
    useEffect(() => {
        fetchRiders();
    }, [order]);

    const fetchRiders = async () => {
        try {
            setLoading(true);
            setError('');
            
            const authToken = localStorage.getItem('authToken');
            
            if (!authToken) {
                setError('Authentication token not found. Please login again.');
                setLoading(false);
                return;
            }
            
            //api-call
            const response = await axiosInstance.get('/admin/riders', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            
            setRiders(response.data.riders);
        } catch (err) {
            console.error('Error fetching riders:', err);
            setError('Failed to load riders. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Handle rider assignment
    const assignRider = async (riderId) => {
        try {
            setLoading(true);
            setError('');
            
            const authToken = localStorage.getItem('authToken');
            
            if (!authToken) {
                setError('Authentication token not found. Please login again.');
                setLoading(false);
                return;
            }
            
            //api-call
            await axiosInstance.put(`/admin/orders/${order._id}/assign-rider`, {
                rider_id: riderId
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            
            //name of rider
            const assignedRider = riders.find(rider => rider._id === riderId);
            
            // sucess state
            onSuccess(`Successfully assigned order to ${assignedRider.name}!`);
            
            // fetch again
            fetchRiders();
        } catch (err) {
            console.error('Error assigning rider:', err);
            setError('Failed to assign rider. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (!order) return null;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden md:w-2/5">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-deep-navy">Assign Rider</h2>
            </div>
            
            <div className="p-6">
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                        <p>{error}</p>
                    </div>
                )}
                
                {order.rider_id ? (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Currently Assigned Rider:</p>
                        <div className="flex items-center space-x-3 p-3 border border-green-200 bg-green-50 rounded-md">
                            <div className="h-10 w-10 rounded-full bg-deep-navy text-white flex items-center justify-center text-lg font-bold">
                                R
                            </div>
                            <div>
                                <h4 className="font-medium">{order.rider_id.name}</h4>
                                <p className="text-xs text-gray-600">{order.rider_id.email}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-4 mb-2">Assign a different rider:</p>
                    </div>
                ) : (
                    <p className="text-gray-600 mb-4">Select a rider to assign to this order:</p>
                )}
                
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-deep-navy rounded-full"></div>
                    </div>
                ) : riders.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-gray-600">No riders available.</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {riders.map(rider => (
                            <div key={rider._id} className="border border-gray-200 rounded-md p-3 hover:bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-full bg-deep-navy text-white flex items-center justify-center text-lg font-bold">
                                            R
                                        </div>
                                        <div>
                                            <h4 className="font-medium">{rider.name}</h4>
                                            <p className="text-xs text-gray-600">{rider.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-right mr-3">
                                            <p className="text-xs text-gray-600">Orders</p>
                                            <p className="font-medium text-center">{rider.orderCount}</p>
                                        </div>
                                        <button 
                                            onClick={() => assignRider(rider._id)}
                                            className="px-3 py-1 bg-mustard-yellow text-deep-navy cursor-pointer font-medium rounded-md hover:bg-opacity-90 transition-colors"
                                            disabled={order.rider_id && order.rider_id._id === rider._id}
                                        >
                                            {order.rider_id && order.rider_id._id === rider._id ? 'Assigned' : 'Assign'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}