import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import './App.css';
import { Layout } from './layout/Layout';
import { Routes } from './routes/Routes';
import { FirebaseContext, Firebase } from './authentication/firebase';

const client = new ApolloClient({
    uri: 'http://localhost:5000/',
});

const firebase = new Firebase();

const App: React.FC = () => {
  const [user, setUserState] = useState<null | any>(null)

  return (
    <FirebaseContext.Provider value={{firebase: firebase, setUser: (user) => { setUserState(user) }, user: user}}>
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
