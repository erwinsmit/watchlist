import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import './App.css';
import { Layout } from './layout/Layout';
import { Routes } from './routes/Routes';
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
    uri: 'http://localhost:5000/',
});


const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Layout>
          <Routes />  
        </Layout>
      </Router>
    </ApolloProvider>
  );
}

export default App;
