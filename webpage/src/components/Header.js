import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link  } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

function Header() {
    const { isAuthenticated, logout } = useAuth();
    const btnStyle={ 
        color: '#000', 
        fontWeight: 'bold', 
        borderBottom: '2px solid transparent',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '4px',
    marginRight: '16px',
        pb: '5px',
        '&:hover': {
            borderBottom: '2px solid #000'
        }
    };
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
                    <Link to="/Dashboard" style={{ textDecoration: 'none', color: 'inherit' }}> 
                    <Button color="inherit" sx={btnStyle} >
                        Dashboard
                    </Button></Link>
                    <Link to="/Profile" style={{ textDecoration: 'none', color: 'inherit' }}> 
                    <Button color="inherit" sx={btnStyle} >
                        Profile
                    </Button></Link>

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















