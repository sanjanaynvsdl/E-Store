import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/api';
import { useCart } from '../../context/cart-context';

export default function ProductDetails() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addedToCart, setAddedToCart] = useState(false);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                setError('');
                
                const authToken = localStorage.getItem('authToken');
                
                if (!authToken) {
                    setError('Authentication token not found. Please login again.');
                    setLoading(false);
                    return;
                }
                
                //api-call to get product details
                const response = await axiosInstance.get(`/customer/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                
                const productData = response.data.product;
                setProduct(productData);
                
                // Set initial color, size and variant
                if (productData) {
                    if (productData.colors && productData.colors.length > 0) {
                        setSelectedColor(productData.colors[0]);
                    }
                    
                    if (productData.sizes && productData.sizes.length > 0) {
                        setSelectedSize(productData.sizes[0]);
                    }
                    
                    if (productData.variants && productData.variants.length > 0) {
                        setSelectedVariant(productData.variants[0]);
                    }
                }
            } catch (err) {
                console.error('Error fetching product details:', err);
                setError('Failed to load product details. Please try again later.');

            } finally {
                setLoading(false);
            }
        };
        
        fetchProductDetails();
    }, [id]);

    //update variant on color, size change
    useEffect(() => {
        if (product && selectedColor && selectedSize) {
            const variant = product.variants.find(
                v => v.color === selectedColor && v.size === selectedSize
            );
            
            if (variant) {
                setSelectedVariant(variant);
            }
        }
    }, [selectedColor, selectedSize, product]);

    //img-index update on color change
    useEffect(() => {
        if (product && selectedColor) {
            const colorIndex = product.imagesByColor.findIndex(img => img.color === selectedColor);
            if (colorIndex !== -1) {
                setCurrentImageIndex(colorIndex);
            }
        }
    }, [selectedColor, product]);


    const handlePrevImage = () => {
        if (product && product.imagesByColor.length > 0) {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === 0 ? product.imagesByColor.length - 1 : prevIndex - 1
            );
        }
    };

    const handleNextImage = () => {
        if (product && product.imagesByColor.length > 0) {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === product.imagesByColor.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    const handleAddToCart = () => {
        if (!product || !selectedVariant) return;
        
        //adding item to cart context
        addToCart({
            productId: product._id,
            variantId: selectedVariant._id,
            name: product.name,
            imageUrl: product.imagesByColor.find(img => img.color === selectedColor)?.imageUrl || '',
            color: selectedColor,
            size: selectedSize,
            price: selectedVariant.price,
            quantity: 1
        });
        
        // local notification state
        setAddedToCart(true);
        
        setTimeout(() => {
            const notificationElement = document.getElementById('cart-notification');
            if (notificationElement) {
                notificationElement.classList.add('opacity-0');
                setTimeout(() => {
                    // Check again in case component unmounted
                    const element = document.getElementById('cart-notification');
                    if (element) {
                        element.classList.remove('opacity-0');
                    }
                }, 300);
            }
        }, 3000);
    };
    
    const handleProceedToCheckout = () => {
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mustard-yellow"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md my-4">
                <p>{error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="bg-light-gray p-8 rounded-xl text-center">
                <h2 className="text-xl text-deep-navy">Product not found</h2>
                <Link to="/products" className="text-mustard-yellow hover:underline mt-4 inline-block">
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="py-4">

            {/* Back to products link */}
            <Link to="/products" className="text-deep-navy hover:text-mustard-yellow flex items-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Products
            </Link>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Images Section */}
                    <div className="relative">
                        <div className="relative h-80 border-1 border-light-gray rounded-lg overflow-hidden mb-4">
                            {product.imagesByColor.length > 0 && (
                                <img 
                                    src={product.imagesByColor[currentImageIndex].imageUrl} 
                                    alt={`${product.name} - ${product.imagesByColor[currentImageIndex].color}`}
                                    className="w-full h-full object-contain"
                                />
                            )}
                            
                            {/* arrows, to see all images */}
                            {product.imagesByColor.length > 1 && (
                                <>
                                    <button 
                                        onClick={handlePrevImage}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-light-gray rounded-full p-2 shadow-md hover:bg-gray-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={handleNextImage}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-light-gray rounded-full p-2 shadow-md hover:bg-gray-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                        
                        {/* thumbnail Images */}
                        {product.imagesByColor.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {product.imagesByColor.map((image, index) => (
                                    <div 
                                        key={image._id}
                                        className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${index === currentImageIndex ? 'border-mustard-yellow' : 'border-transparent'}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    >
                                        <img 
                                            src={image.imageUrl} 
                                            alt={`${product.name} - ${image.color}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Product Details Section */}
                    <div>
                        <h1 className="text-2xl font-bold text-deep-navy mb-2">{product.name}</h1>
                        <p className="text-gray-600 mb-4">{product.category}</p>
                        
                        {selectedVariant && (
                            <div className="text-2xl font-bold text-deep-navy mb-6">
                                ₹{selectedVariant.price.toLocaleString()}
                            </div>
                        )}
                        
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-gray-700">{product.description}</p>
                        </div>
                        
                        {/* Color Selection */}
                        {product.colors.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Color</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-4 py-2 rounded-md border ${selectedColor === color ? ' bg-gray-300  bg-opacity-10 border-gray-300' : 'border-light-gray'}`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Size Selection */}
                        {product.sizes.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 rounded-md border ${selectedSize === size ? 'bg-gray-300  bg-opacity-10 border-gray-300' : 'border-light-gray'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Add to Cart/Proceed to Checkout Button */}
                        <div className="relative">
                            <button
                                onClick={addedToCart ? handleProceedToCheckout : handleAddToCart}
                                className="w-full md:w-auto px-6 py-3 cursor-pointer bg-mustard-yellow text-deep-navy font-semibold rounded-lg hover:bg-opacity-90  hover:scale-105 duration-200 flex items-center justify-center"
                            >
                                {!addedToCart ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Add to Cart
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        Proceed to Checkout
                                    </>
                                )}
                            </button>
                            
                            {/* notification */}
                            <div 
                                id="cart-notification" 
                                className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 text-sm px-4 py-2 rounded-md shadow-md transition-opacity duration-300 ${!addedToCart ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            >
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Added to cart!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}