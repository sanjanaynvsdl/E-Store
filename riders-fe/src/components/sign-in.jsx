import { useState } from "react";
import {auth, provider} from "../utils/firebase/config";

import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import orderrider from "../assets/order-rider.png";
import axiosInstance from "../utils/api/axiosInstance";


export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setRole, setAuthToken } = useAuth();

  const handleSignin = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Sign in with Google popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get Firebase ID token
      const idToken = await user.getIdToken();
      console.log(` got the token from the firebase!${idToken}`);
      
      const response = await axiosInstance.post(
        "/auth/rider/signin",
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );
      
      
      // Store token and role in localStorage
        setRole(response.data.role);
        setAuthToken(response.data.token);
      

      const role = response.data.role
      // Redirect based on role
      if (role === "rider") {
        navigate("/rider");
      } else {
        navigate("/");
      }

    } catch (error) {

      console.error("Sign-in failed:", error);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-deep-navy mb-2">Welcome to E-Store</h1>
        <p className="text-gray-800 pt-2">Riders, your delivery list is just a click away.</p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}
      
      <button 
        onClick={handleSignin} 
        disabled={loading}
        className="w-full border-none flex items-center justify-center gap-2 bg-light-gray border border-light-gray py-3  rounded-xl  hover:scale-105 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
      >
        {loading ? (
          <div className="animate-spin h-5 w-5 border-t-2 border-deep-navy rounded-full"></div>
        ) : (
          <>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
            <span className="text-black font-medium">Sign in with Google</span>
          </>
        )}
      </button>
      
      <div className="mt-6 text-center text-sm text-gray-800">
        <p>Only approved emails can sign in</p>
        <p className="mt-2">Need help? Contact admin <a href="mailto:sanjanayalamarthi@gmail.com" className="text-[#FCA311] hover:underline">sanjanayalamarthi@gmail.com</a></p>
      </div>
      
      <div className="mt-8 flex justify-center">
        <img src={orderrider} alt="Woman Thinking" className="max-h-[350px]" />
      </div>
    </div>
  );
}
