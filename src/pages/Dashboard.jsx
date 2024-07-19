import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { deleteUser, signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { useAuth } from '../AuthContext';
import AddTaskForm from '../component/AddTaskForm'
import TaskList from '../component/TaskList';
import { Button, Stack } from "@mui/material";

function Dashboard() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            navigate(`/`);
        }
    }, [user, navigate]);

    // Delete account function
    const deleteAccount = async () => {
        try {
          if (user) {
            await deleteUser(user);
    
            // Remove the user's entry from taskdata in localStorage
            let taskdata = JSON.parse(localStorage.getItem("taskdata")) || [];
            taskdata = taskdata.filter(item => item.user !== user.email);
            localStorage.setItem("taskdata", JSON.stringify(taskdata));
    
            // Remove authToken from localStorage
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
            <Stack
                direction="row"
                justifyContent="flex-end"
                gap="20px"
                sx={{ mb: 5, mt: 2 }}
            >

                <AddTaskForm />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleLogout}
                >
                    Sign Out
                </Button>
                <Button
                    //   fullWidth
                    variant="outlined"
                    color="error"
                    onClick={deleteAccount}
                >
                    Delete Account
                </Button>
            </Stack>
            <TaskList />
        </>
    );
}

export default Dashboard;
