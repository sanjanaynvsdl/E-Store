import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';

export default function CustomerLayout({ children }) {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Customer Navbar */}
      <nav className="bg-deep-navy text-white sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/products" className="text-xl font-bold text-mustard-yellow">E-Store</Link>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/products" className="hover:text-mustard-yellow transition-colors">Home</Link>
            <Link to="/orders" className="hover:text-mustard-yellow transition-colors">My Orders</Link>
            <Link to="/account" className="hover:text-mustard-yellow transition-colors">Account</Link>
          </div>
          
          <div className="flex items-center gap-4">
            
            {/* Cart icon with counter */}
            <Link to="/cart" className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-mustard-yellow text-deep-navy text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
            
            {currentUser && (
              <div className="flex items-center">
                <span className="text-sm mr-2 hidden md:inline">{currentUser.displayName}</span>
                {currentUser.photoURL && (
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    className="h-8 w-8 rounded-full"
                  />
                )}
              </div>
            )}
            
            <button 
              onClick={handleLogout}
              className="px-3 py-1 bg-mustard-yellow text-deep-navy rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Logout
            </button>
            
            {/* Mobile menu button */}
            <button className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu - hidden by default */}
      <div className="md:hidden hidden bg-deep-navy text-white">
        <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
          <Link to="/products" className="py-2 hover:text-mustard-yellow transition-colors">Home</Link>
          <Link to="/orders" className="py-2 hover:text-mustard-yellow transition-colors">My Orders</Link>
          <Link to="/account" className="py-2 hover:text-mustard-yellow transition-colors">Account</Link>
        </div>
      </div>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
