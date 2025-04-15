import React from 'react';
import { useCart } from '../context/cart-context';

export default function CartItem({ item, index }) {
  const { removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      updateQuantity(index, newQuantity);
    }
  };

  return (
    <div className="flex  py-4">
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0 bg-white rounded-md overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Product Details */}
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium text-deep-navy">{item.name}</h3>
          <span className="font-bold text-deep-navy">₹{item.price.toLocaleString()}</span>
        </div>
        
        <div className="text-sm text-gray-600 mt-1">
          <span className="mr-4">Size: {item.size}</span>
          <span>Color: {item.color}</span>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <label htmlFor={`quantity-${index}`} className="text-sm text-gray-600 mr-2">Qty:</label>
            <select 
              id={`quantity-${index}`}
              value={item.quantity} 
              onChange={handleQuantityChange}
              className="border border-gray-300 rounded-md px-2  py-1 text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option  key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => removeFromCart(index)}
            className="text-red-500 text-sm hover:text-red-700 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
