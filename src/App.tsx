import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import './App.css';
import { Layout } from './layout/Layout';
import { Routes } from './routes/Routes';
import { FirebaseContextProvider } from './authentication/firebase';

const client = new ApolloClient({
  uri: 'http://localhost:5001',
  request: (operation) => {
    const token = sessionStorage.getItem('token')
    operation.setContext({
      headers: {
        authorization: token ? token : ''
      }
    })
  }
})

const App: React.FC = () => {
  return (
    <FirebaseContextProvider>
      <ApolloProvider client={client}>
        <Router>
          <Layout>
            <Routes />  
          </Layout>
        </Router>
      </ApolloProvider>
    </FirebaseContextProvider>
  );
}

export default App;
