import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const btnStyle={ 
    color: '#000', 
    fontWeight: 'bold', 
    borderBottom: '2px solid transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    pb: '5px',
    '&:hover': {
        borderBottom: '2px solid #000'
    }
};
function Navbar() {
    return (
        <AppBar 
            position="static" 
            sx={{ 
                background: 'transparent',
                boxShadow: 'none'
            }}
        >
            <Toolbar>
                <Link to="/Dashboard" style={{ 
                        textDecoration: 'none', 
                        color: 'inherit', 
                        margin: '0 10px'
                    }}>
                    <Button color="inherit" sx={btnStyle}>
                        Dashboard
                    </Button>
                </Link>
                <Link to="/Profile" style={{ 
                        textDecoration: 'none', 
                        color: 'inherit', 
                        margin: '0 10px'
                    }}>
                    <Button color="inherit" sx={btnStyle}>
                        Profile
                    </Button>
                </Link>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
