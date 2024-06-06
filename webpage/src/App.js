
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';


const App = () => {
  return (
    <Router>
      <div>   
        <Routes>
          <Route path="/" element={<Login/>}/>  {/* Initially load Log in page */}   
          <Route path="/Signup" element={<Signup/>}/> 
          <Route path="/Login" element={<Login/>}/> 
          <Route path="/Home" element={<Home/>}/>
        </Routes>
      </div>
    </Router>
    
    
  );
};

export default App;

