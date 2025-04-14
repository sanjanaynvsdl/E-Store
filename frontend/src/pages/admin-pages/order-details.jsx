import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import OrderSummaryforAdmin from "../../components/order-summary";
import RidersList from "../../components/riders-list";
import axiosInstance from '../../utils/api';

export default function OrderDetailsPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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
            const response = await axiosInstance.get(`/admin/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            
            setOrder(response.data.order);
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError('Failed to load order details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    //sucess msg, from children comp ex: status update, assing rider!
    const handleSuccess = (message) => {
        setSuccessMessage(message);
        
        fetchOrderDetails();
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };

    // format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return(
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
                            to="/admin" 
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

                    <div className="flex md:flex-row flex-col gap-6 mb-6">
                        <OrderSummaryforAdmin order={order} onSuccess={handleSuccess} />
                        <RidersList order={order} onSuccess={handleSuccess} />
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-deep-navy">Order Items</h2>
                        </div>
                        
                        <div className="p-6">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-8 py-4 border-b border-light-gray last:border-b-0">
                                    {/* Product Image */}
                                    <div className="w-20 h-20 flex-shrink-0 bg-light-gray rounded-md overflow-hidden">
                                        <img 
                                            src={item.product_id.imagesByColor?.find(img => img.color === item.color)?.imageUrl || ''}
                                            alt={item.product_id.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    
                                    {/* Product Details */}
                                    <div className="flex-grow">
                                        <h3 className="text-deep-navy font-medium">{item.product_id.name}</h3>
                                        
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
                </>
            ) : (
                <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-xl font-medium mb-2">Order Not Found</h3>
                    <p className="text-gray-600 mb-4">The order you're looking for doesn't exist or you don't have permission to view it.</p>
                    <Link 
                        to="/admin/dashboard"
                        className="px-6 py-2 bg-mustard-yellow text-deep-navy font-semibold rounded-lg hover:bg-opacity-90 transition-colors inline-block"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            )}
        </div>
    )
}