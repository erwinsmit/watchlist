import React, { useState, useEffect } from 'react';
import app from 'firebase/app';
import firebase from 'firebase';
import 'firebase/auth';

export const config = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: 'watched-films.firebaseapp.com',
    databaseURL: 'https://watched-films.firebaseio.com',
    projectId: 'watched-films',
    storageBucket: 'watched-films.appspot.com',
    messagingSenderId: '122639357109'
};

type ContextModel = {
    token?: string;
    user?: app.User;
    login: () => void;
}

export const FirebaseContext = React.createContext<ContextModel>({
    login: () => { }
});

export const FirebaseContextProvider: React.FC = ({ children }) => {
    let auth: undefined | app.auth.Auth;
    let provider: undefined | app.auth.GoogleAuthProvider;

    useEffect(
        () => {
            app.initializeApp(config);  
            auth = app.auth();
            provider = new firebase.auth.GoogleAuthProvider();
        }, 
        []
    );

    const [user, setUserState] = useState<null | any>(null)
    const [token, setToken] = useState<string>();

    async function login() {
        if (auth && provider) {
            auth.signInWithPopup(provider).then(async (result: firebase.auth.UserCredential) => {
                const user = result.user;
                const token = await user?.getIdToken();
                if (token) {
                    window.sessionStorage.setItem('token', token);
                    setUserState(user);
                    setToken(token);
                }
            });
        }
    }
    
    return (
        <FirebaseContext.Provider value={{
            user: user,
            token: token,
            login: login
          }}>
          {children}
        </FirebaseContext.Provider>
    )
}
    
