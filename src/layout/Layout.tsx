import React, { useContext, useState } from 'react';
import { Link, AppBar, Toolbar, Box, Container, Button, IconButton, makeStyles } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { NavLink } from 'react-router-dom';
import { FirebaseContext } from '../authentication/firebase';

const useStyles = makeStyles(theme => ({
	menuButton: {
		marginRight: theme.spacing(2)
	},
	menuItems: {
		flexGrow: 1,
	}
}));

export const Layout: React.FC = ({ children }) => {
	const firebaseContext = useContext(FirebaseContext);
	const classes = useStyles();

	return (
		<Box bgcolor="grey.100">
			<AppBar position="sticky">
				<Toolbar>
					<Link color="inherit" component={NavLink} to="/">
						Home
					</Link>
					<Box ml={1} className={classes.menuItems}>
						<Link component={NavLink} to="/watchlist" color="inherit">
							Watchlist
						</Link>
					</Box>
					{!firebaseContext.user &&
						<IconButton onClick={firebaseContext.login} edge="end" color="inherit">
							<AccountCircle />
						</IconButton>
					}

					{firebaseContext.user &&
						<IconButton edge="end" color="inherit">
							<AccountCircle /> {firebaseContext.user.displayName}
						</IconButton>
					}
				</Toolbar>
			</AppBar>

			<Container maxWidth="lg">
				{children}
			</Container>
		</Box>
	);

};