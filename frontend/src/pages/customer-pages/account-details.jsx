import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import axiosInstance from '../../utils/api';

export default function AccountDetailsPage() {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                
                // fetch user's orders
                const response = await axiosInstance.get('/customer/orders', {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                
                setOrders(response.data.orders);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrders();
    }, []);

    // format date 
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="py-6">
            <h1 className="text-2xl font-bold text-deep-navy mb-6">Account Details</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
                    <p>{error}</p>
                </div>
            )}
            
            {/* User Information */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                    {currentUser?.photoURL && (
                        <img 
                            src={currentUser.photoURL} 
                            alt="Profile" 
                            className="h-16 w-16 rounded-full"
                        />
                    )}
                    
                    <div>
                        <h3 className="text-lg font-medium">{currentUser?.displayName || 'User'}</h3>
                        <p className="text-gray-600">{currentUser?.email || 'No email available'}</p>
                    </div>
                </div>
            </div>
            
            {/* Order History */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <h2 className="text-xl font-semibold mb-4">Order History</h2>
                
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-deep-navy rounded-full"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
                        <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                        <Link 
                            to="/products"
                            className="px-6 py-2 bg-mustard-yellow text-deep-navy font-semibold rounded-lg hover:bg-opacity-90 transition-colors inline-block"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="border border-light-gray rounded-lg overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-light-gray p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                                    <div>
                                        <p className="text-sm text-gray-600">Order Placed</p>
                                        <p className="font-medium">{formatDate(order.createdAt)}</p>
                                    </div>
                                    
                                    <div className="mt-2 md:mt-0">
                                        <p className="text-sm text-gray-600">Total</p>
                                        <p className="font-medium">₹{order.total_price.toLocaleString()}</p>
                                    </div>
                                    
                                    <div className="mt-2 md:mt-0">
                                        <p className="text-sm text-gray-600">Order ID</p>
                                        <p className="font-medium">{order._id}</p>
                                    </div>
                                    
                                    <div className="mt-2 md:mt-0">
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Order Items */}
                                <div className="p-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-4 py-4 border-b border-light-gray last:border-b-0">
                                            {/* Product Image */}
                                            <div className="w-20 h-20 flex-shrink-0 bg-light-gray rounded-md overflow-hidden">
                                                <img 
                                                    src={item.product_id.imagesByColor.find(img => img.color === item.color)?.imageUrl || ''}
                                                    alt={item.product_id.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            
                                            {/* Product Details */}
                                            <div className="flex-grow">
                                                <Link 
                                                    to={`/products/${item.product_id._id}`}
                                                    className="text-deep-navy hover:text-mustard-yellow font-medium"
                                                >
                                                    {item.product_id.name}
                                                </Link>
                                                
                                                <div className="text-sm text-gray-600 mt-1">
                                                    <span className="mr-3">Size: {item.size}</span>
                                                    <span>Color: {item.color}</span>
                                                </div>
                                                
                                                <div className="mt-2">
                                                    <span className="font-medium">₹{item.price.toLocaleString()}</span>
                                                    <span className="text-sm text-gray-600 ml-2">Qty: {item.quantity || 1}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}