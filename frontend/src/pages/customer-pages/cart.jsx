import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/cart-context';
import CartItem from '../../components/cart-item';
import axiosInstance from '../../utils/api';

export default function CartPage() {
    const { cartItems, clearCart, getTotalPrice, getTotalItems } = useCart();
    
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [error, setError] = useState('');
    
    // Address form state
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [addressUpdated, setAddressUpdated] = useState(false);
    
    const handleUpdateAddress = async () => {
        if (!phone || !street || !city || !pincode) {
            setError('Please fill in all address fields');
            return;
        }
        
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
            await axiosInstance.put('/customer/profile', {
                phone,
                address: {
                    street,
                    city,
                    pincode
                }
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            
            setAddressUpdated(true);
            setTimeout(() => setAddressUpdated(false), 3000);

        } catch (err) {
            console.error('Error updating address:', err);
            setError('Failed to update address. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleCheckout = async () => {
        if (!addressUpdated && (!phone || !street || !city || !pincode)) {
            setError('Please update your address before checkout');
            return;
        }
        
        if (cartItems.length === 0) {
            setError('Your cart is empty');
            return;
        }
        
        try {
            setLoading(true);
            setError('');
            const authToken = localStorage.getItem('authToken');
            
            if (!authToken) {
                setError('Authentication token not found. Please login again.');
                setLoading(false);
                return;
            }
            
            //order-items
            const orderItems = cartItems.map(item => ({
                product_id: item.productId,
                size: item.size,
                color: item.color,
                price: item.price,
                quantity: item.quantity
            }));
            
            //api-call
            await axiosInstance.post('/customer/orders', {
                items: orderItems
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            
            // clear cart, show success message
            clearCart();
            setOrderSuccess(true);

        } catch (err) {
            
            console.error('Error creating order:', err);
            setError('Failed to create order. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // If order was successful, show success message
    if (orderSuccess) {
        return (
            <div className="py-8 px-4 text-center">
                <div className="bg-green-100 text-green-800 p-6 rounded-xl mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
                    <p className="mb-4">You will receive your order soon.</p>
                </div>
                
                <Link 
                    to="/products"
                    className="px-6 py-3 cursor-pointer bg-[#FDD16A] text-deep-navy font-semibold  hover:scale-105 transition-all duration-200 rounded-lg inline-block"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }
    
    // If cart is empty, show empty cart message
    if (cartItems.length === 0) {
        return (
            <div className="py-8 px-4 text-center">
                <div className="bg-light-gray p-8 rounded-xl mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-deep-navy mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-6">Explore our products and add items to your cart</p>
                    
                    <Link 
                        to="/products"
                        className="px-6 py-3 bg-mustard-yellow text-deep-navy font-semibold rounded-lg hover:bg-opacity-90 transition-colors inline-block"
                    >
                        Explore Products
                    </Link>
                </div>
            </div>
        );
    }
    
    return (
        <div className="py-6">
            <h1 className="text-2xl font-bold text-deep-navy mb-6">Your Cart</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
                    <p>{error}</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items -> Left Side */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                        <h2 className="text-xl font-semibold mb-4">Cart Items ({getTotalItems()})</h2>
                        
                        <div className="">
                            
                            {cartItems.map((item, index) => (
                                <div className='border-y border-light-gray' key={index}>
                                    <CartItem key={index} item={item} index={index} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Address and Checkout -> Right Side */}
                <div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-mustard-yellow"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            
                            <div>
                                <input
                                    type="text"
                                    id="street"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-mustard-yellow"
                                    placeholder="Enter your street address"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    
                                    <input
                                        type="text"
                                        id="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-mustard-yellow"
                                        placeholder="City"
                                    />
                                </div>
                                
                                <div>
                                   
                                    <input
                                        type="text"
                                        id="pincode"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-mustard-yellow"
                                        placeholder="Pincode"
                                    />
                                </div>
                            </div>
                            
                            <button
                                onClick={handleUpdateAddress}
                                disabled={loading}
                                className="w-full px-4 py-2 bg-[#14213D] text-white font-medium cursor-pointer rounded-md  hover:bg-[#14213D]/90 transition-all flex items-center justify-center"
                            >
                                {loading ? (
                                    <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                                ) : (
                                    'Update Address'
                                )}
                            </button>
                            
                            {addressUpdated && (
                                <div className="bg-green-100 text-green-800 text-center py-2 rounded-md">
                                    Address updated successfully!
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Order Summary and Checkout */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Items ({getTotalItems()}):</span>
                                <span className="font-medium">₹{getTotalPrice().toLocaleString()}</span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery:</span>
                                <span className="font-medium">₹0</span>
                            </div>
                            
                            <div className="border-t border-light-gray my-2 pt-2">
                                <div className="flex justify-between font-bold">
                                    <span>Total:</span>
                                    <span>₹{getTotalPrice().toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        
                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full px-4 py-3 cursor-pointer bg-[#FDD16A] text-deep-navy font-semibold rounded-md hover:bg-[#FDD16A]/75 transition-colors flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-deep-navy rounded-full"></div>
                            ) : (
                                'Proceed to Checkout'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}