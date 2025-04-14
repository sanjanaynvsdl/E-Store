import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/api';
import ProductCard from '../../components/product-card';

export default function ProductsListPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError('');
                
                
                const authToken = localStorage.getItem('authToken');
                
                if (!authToken) {
                    setError('Authentication token not found. Please login again.');
                    setLoading(false);
                    return;
                }
                
                //  api-call
                const response = await axiosInstance.get('/customer/products', {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                
                setProducts(response.data.products || []);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchProducts();
    }, []);

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

    return (
        <div className="py-6">
            <h1 className="text-2xl font-bold text-deep-navy mb-6">Our Products</h1>
            
            {products.length === 0 ? (
                <div className="bg-light-gray p-8 rounded-xl text-center">
                    <h2 className="text-xl text-deep-navy">No products available</h2>
                    <p className="text-gray-600 mt-4">Check back later for new arrivals!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}