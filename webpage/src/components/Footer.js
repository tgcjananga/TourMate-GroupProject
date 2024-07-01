import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
    return (
        <Box component="footer" sx={{ py: 1, px: 2, mt: 'auto', backgroundColor: 'primary.main', color: 'white' }}>
            <Typography variant="body1" align="center">
                &copy; {new Date().getFullYear()} Tour Mate. All rights reserved.
            </Typography>
        </Box>
    );
}

export default Footer;
