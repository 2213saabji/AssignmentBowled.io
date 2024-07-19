import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import { useAuth } from './AuthContext';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            navigate(`/`);
        }
    }, [])


    const handleLogout = () => {
        signOut(auth).then(() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
            navigate(`/`);
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    };
    return (
        <>
            login welcome;
            <button onClick={handleLogout}>Signout Account</button>

        </>
    )
}

export default Dashboard;