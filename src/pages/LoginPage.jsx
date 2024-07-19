import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, getIdToken } from "firebase/auth";
import { useAuth } from '../AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent
} from "@mui/material";
import { useTasks } from "../context/TaskContext";

function LoginPage() {
  const { setTasks } = useTasks(); 
  
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);

  // Signup function
  const signup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const token = await getIdToken(user);
      localStorage.setItem("authToken", token);

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        phoneNumber: phoneNumber,
        token: token,
        createdAt: new Date()
      });

      let taskdata = JSON.parse(localStorage.getItem("taskdata")) || [];
      const userIndex = taskdata.findIndex(item => item?.user === user?.email);

      if (userIndex === -1) {
        taskdata.push({ user: user.email, data: {} });
        localStorage.setItem("taskdata", JSON.stringify(taskdata));
      }

      setUser(user);
      navigate(`/dashboard`);

      console.log("User signed up:", user);
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };


  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
     
      const token = await getIdToken(user);
      localStorage.setItem("authToken", token);

      let taskdata = JSON.parse(localStorage.getItem("taskdata")) || [];
      const userIndex = taskdata.findIndex(item => item?.user === user?.email);

      if (userIndex === -1) {
        taskdata.push({ user: user.email, data: {} });
        localStorage.setItem("taskdata", JSON.stringify(taskdata));
      }

      const userTasks = taskdata.find(item => item?.user === user?.email)?.data || {};
      setTasks(userTasks);

      navigate(`/dashboard`);
      setUser(user);
    } catch (error) {
      console.error("Error logging in:", error.message);
      setWrongPassword(true);
    }
  };


  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser != null) {

        let taskdata = JSON.parse(localStorage.getItem("taskdata")) || [];
        const userTasks = taskdata.find(item => item?.user === currentUser?.email)?.data || {};
        setTasks(userTasks);

        localStorage.setItem("user", JSON.stringify(currentUser?.email));
        navigate(`/dashboard`);

      }
    });
    return () => unsubscribe();
  }, [navigate, setUser,setTasks]);

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 400, p: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            {user ? "Welcome Back" : "Login / Signup"}
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ mt: 2 }}
          >
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              type="tel"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={signup}
            >
              Signup
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={login}
            >
              Login
            </Button>
            {wrongPassword && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Email or Password is incorrect
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default LoginPage;
