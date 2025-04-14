import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';

export default function AdminLayout({ children }) {
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
    <div className="min-h-screen bg-white">
      {/* Admin Navbar */}
      <nav className="bg-deep-navy text-white sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/admin" className="text-xl font-bold text-mustard-yellow">E-Store Admin</Link>
          
          
          
          <div className="flex items-center gap-4">
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
            {/* <button 
              onClick={handleLogout}
              className="px-3 py-1 bg-mustard-yellow text-deep-navy rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Logout
            </button> */}
            
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
          <Link to="/admin" className="py-2 hover:text-mustard-yellow transition-colors">Dashboard</Link>
          <Link to="/admin/products" className="py-2 hover:text-mustard-yellow transition-colors">Manage Products</Link>
          <Link to="/admin/orders" className="py-2 hover:text-mustard-yellow transition-colors">Orders</Link>
        </div>
      </div>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
