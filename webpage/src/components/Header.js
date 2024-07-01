import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link  } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

function Header() {
    const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Optionally redirect to homepage or another appropriate page after logout
  };
    return (

        
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Tour Mate
                </Typography>
                
                {isAuthenticated ? (<>

                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}> 
                    <Button color="inherit" variant='outlined' style={{ padding: '8px' ,backgroundColor: '#f44336', color: '#ffffff' }} onClick={handleLogout}>
                        Logout
                    </Button></Link>
    

                </>):(<>
                    <Link to="/Login" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Button color="inherit" variant='outlined' style={{ padding: '8px', marginRight: '16px'}}>
                        Login
                    </Button></Link>
                    <Link to="/Signup" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Button color="inherit" variant='outlined' style={{ padding: '8px' ,backgroundColor: '#2196f3', color: '#ffffff'}}>
                        SignUp
                    </Button></Link>
                </>)}
            </Toolbar>
        </AppBar>
    );
}

export default Header;















