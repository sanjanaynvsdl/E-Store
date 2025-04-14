import { useState } from "react";
import { auth, provider } from "../firebase/config";
import { signInWithPopup } from "firebase/auth";

export default function SignIn() {
  const [data, setData] = useState("");

  const handleSignin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken();

      console.log("Firebase ID Token:", idToken); // Paste this in Postman
      console.log("User Data:", user);

      setData(user);
      alert("Logged in successfully!");


    } catch (error) {
      console.error(" Sign-in failed:", error);
      alert("Login failed. Check console for error.");
    }
  };
  return (
    <div>
      <button onClick={handleSignin} className="text-black bg-white p-2 rounded-lg">Sign In with Google</button>
    </div>
  );
}
