import { BrowserRouter,Routes,Route,Navigate, useLocation } from "react-router-dom"
import { AuthProvider,useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SalesLog from "./pages/SalesLog.jsx";
import Navbar from "./components/Navbar.jsx";
import Products from "./pages/Products.jsx";
import Home from "./pages/Home.jsx";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/home" />;
};

function AppRoutes(){
  const location= useLocation();
  const hidenavbar=["/login","/register"].includes(location.pathname) 
  return(
    <>
    {!hidenavbar && <Navbar/>}
    <Routes>
      <Route path="/home" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>

      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>

      <Route path="/sales" element={<PrivateRoute><SalesLog /></PrivateRoute>}/>
      <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>}/>
      <Route path="*" element={<Navigate to={"/home"} />}/>
    </Routes>
    </>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter><AppRoutes/></BrowserRouter>
    </AuthProvider>
  )
}

export default App