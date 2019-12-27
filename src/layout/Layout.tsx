import React from 'react';
import { Link, AppBar, Toolbar, Box, Container } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

export const Layout: React.FC = ({children}) => {
  return (
    <Box bgcolor="grey.100">
      <AppBar position="sticky">
        <Toolbar>
          <Link color="inherit" component={NavLink} to="/">
            Home
          </Link>
          <Box ml={1}>
          <Link component={NavLink} to="/watchlist" color="inherit"> 
              Watchlist
          </Link>
          </Box>
        </Toolbar>
      </AppBar>   

      <Container maxWidth="lg">
        {children}
      </Container>
    </Box>
  );
};