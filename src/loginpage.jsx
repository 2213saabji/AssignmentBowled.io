import { useState, useEffect } from "react";
import { auth, db } from "./firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, onAuthStateChanged, getIdToken } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
function LoginPage() {
    const { user,setUser } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
  

    // Signup function
    const signup = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Get token
        const token = await getIdToken(user);
        localStorage.setItem("authToken", token);
  
        // Save additional user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          phoneNumber: phoneNumber,
          token: token,
          createdAt: new Date()
        });
  
        setUser(user);
        console.log("User signed up:", user);
      } catch (error) {
        console.error("Error signing up:", error.message);
      }
    };
  
    // Login function
    const login = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Get token
        const token = await getIdToken(user);
        localStorage.setItem("authToken", token);
  
        setUser(user);
        console.log("User logged in:", userCredential.user);
      } catch (error) {
        console.error("Error logging in:", error.message);
      }
    };
  
    // Delete account function
    const deleteAccount = async () => {
      try {
        if (user) {
          await deleteUser(user);
          localStorage.removeItem("authToken");
          setUser(null);
          console.log("User account deleted");
        } else {
          console.error("No user is signed in");
        }
      } catch (error) {
        console.error("Error deleting account:", error.message);
      }
    };
  

    // Monitor auth state
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if(currentUser!=null){
            navigate(`/dashboard`);
            localStorage.setItem("user",JSON.stringify(currentUser?.email))
        }
      });
      return () => unsubscribe();
    }, []);
  
    return(
        <>
         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      <button onClick={signup}>Signup</button>
      <button onClick={login}>Login</button>
      <button onClick={deleteAccount}>Delete Account</button>
      {user && <p>Welcome, {user.email}</p>}
        </>
    )
}

export default LoginPage;