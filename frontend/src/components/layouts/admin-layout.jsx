import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useState, useRef, useEffect } from 'react';

export default function AdminLayout({ children }) {
  const { currentUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('idToken');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Admin Navbar - Fixed */}
      <nav className="bg-deep-navy text-white fixed top-0 left-0 right-0 z-50 shadow-md">
        <div className="container mx-auto md:px-18 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/admin" className="text-xl font-bold text-mustard-yellow px-2">E-Store</Link>
            <span className="text-sm text-gray-400 hidden md:inline">(Admin Panel)</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="relative" ref={dropdownRef}>
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <span className="text-sm hidden md:inline ml-2 mr-1">{currentUser.displayName}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* main content */}
      <main className="container mx-auto py-6 pt-20">
        <div className="px-4 sm:px-6 md:px-8 lg:px-18">
          {children}
        </div>
      </main>
    </div>
  );
}
