import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import ProtectedRoutes from './utils/ProtectedRoutes';


const App = () => {
  return (
    <AuthProvider>
    <Router>
      <div>   
        <Routes>
          <Route element={<ProtectedRoutes/>}>
          <Route path="/Home" element={<Home/>}/>
          </Route>
          <Route path="/" element={<Login/>}/>  {/* Initially load Log in page */}   
          <Route path="/Signup" element={<Signup/>}/> 
          <Route path="/Login" element={<Login/>}/> 
          
        </Routes>
      </div>
    </Router>
    </AuthProvider>
    
    
  );
};

export default App;