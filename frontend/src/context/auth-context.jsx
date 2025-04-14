import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      // Get role from localStorage if available
      if (user) {
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) {
          setUserRole(storedRole);
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Set user role and save to localStorage
  const setRole = (role) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  // Save token to localStorage
  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  };

  const value = {
    currentUser,
    userRole,
    loading,
    setRole,
    setAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
