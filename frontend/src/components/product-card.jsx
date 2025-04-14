import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {

  //first-image from array of images
  const firstImage = product.imagesByColor && product.imagesByColor.length > 0 
    ? product.imagesByColor[0].imageUrl 
    : 'https://dn721803.ca.archive.org/0/items/placeholder-image//placeholder-image.jpg';
  
  // price - get's from variant array[0]
  const firstVariantPrice = product.variants && product.variants.length > 0 
    ? product.variants[0].price 
    : 0;

  // Truncate description to a reasonable length
  const truncatedDescription = product.description && product.description.length > 100
    ? `${product.description.substring(0, 100)}...`
    : product.description;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-44 overflow-hidden p-2">
        <img 
          src={firstImage} 
          alt={product.name} 
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-deep-navy truncate">{product.name}</h3>
        
        <p className="text-gray-600 text-sm mt-1 h-16 overflow-hidden">
          {truncatedDescription}
        </p>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xl font-bold text-deep-navy">₹{firstVariantPrice.toLocaleString()}</span>
          
          <Link 
            to={`/products/${product._id}`}
            className="px-3 py-1 bg-mustard-yellow text-deep-navy rounded-lg  transition-transform duration-300 hover:scale-105"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
