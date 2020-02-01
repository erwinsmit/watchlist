import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient, { PresetConfig } from 'apollo-boost';
import './App.css';
import { Layout } from './layout/Layout';
import { Routes } from './routes/Routes';
import { FirebaseContext, Firebase } from './authentication/firebase';

import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

// const httpLink = createHttpLink({
//   uri: 'http://localhost:5001',
// });

// const authLink = setContext((_: any, { headers }: any) => {
//   // get the authentication token from local storage if it exists
//   const token = localStorage.getItem('token');
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `${token}` : "",
//     }
//   }
// });

const client = new ApolloClient({
  uri: 'http://localhost:5001',
  request: (operation) => {
    const token = localStorage.getItem('token')
    operation.setContext({
      headers: {
        authorization: token ? token : ''
      }
    })
  }
})

const firebase = new Firebase();

const App: React.FC = () => {
  const [user, setUserState] = useState<null | any>(null)
  const [token, setToken] = useState<string>();

  return (
    <FirebaseContext.Provider value={{
      firebase: firebase, 
      setUser: (user) => { setUserState(user) }, 
      user: user,
      token: token,
      setToken: (token) => setToken(token)
    }}>
      <ApolloProvider client={client}>
        <Router>
          <Layout>
            <Routes />  
          </Layout>
        </Router>
      </ApolloProvider>
    </FirebaseContext.Provider>
  );
}

export default App;
