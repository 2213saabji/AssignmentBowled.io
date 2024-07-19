import { BrowserRouter as Router,Routes,Route} from "react-router-dom";
import { AuthProvider } from './AuthContext';
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import { TaskProvider } from './context/TaskContext';
function App() {

  return (
  <Router> 
    <AuthProvider>
    <TaskProvider>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
      </TaskProvider>
    </AuthProvider>

  </Router>  
  );
}

export default App;




// import { doc, getDoc } from "firebase/firestore"
// import { db } from "./firebase-config"
// import {useEffect} from "react";
// function App() {
// const docRef=doc(db,"users","EFST8kIMOlgcNqzbL2gj")

// const getData=async()=>{
//   const response=await getDoc(docRef);
//   console.log(response.data());
// }
// useEffect(() => {
//   getData();
// // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [])
//   return (
//     <>
     
//     </>
//   )
// }

// export default App
