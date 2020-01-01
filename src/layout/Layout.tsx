import React, { useContext } from 'react';
import { Link, AppBar, Toolbar, Box, Container, Button } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { FirebaseContext } from '../authentication/firebase';

export const Layout: React.FC = ({children}) => {
  const firebaseContext = useContext(FirebaseContext);

  async function login() {
    await firebaseContext.firebase?.loginWithGoogle();
    if (firebaseContext.firebase) {
      firebaseContext.setUser(firebaseContext.firebase.user);
    }
  }

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
          {!firebaseContext.user &&
          <Box ml={1}>
            <Button onClick={login}  color="inherit"> 
              Login
            </Button>
          </Box>
          }

          {firebaseContext.user &&
            <Box ml={1}>
              Welcome {firebaseContext.user.displayName} - {firebaseContext.user.uid} 
            </Box>
          }  

        </Toolbar>
      </AppBar>   

      <Container maxWidth="lg">
        {children}
      </Container>
    </Box>
  );

};