import React from 'react';
import app, { UserInfo } from 'firebase/app';
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

export class Firebase {
    private auth: any; // todo: check type
    private provider: any;
    public isAuthenticated: boolean;
    public user: app.User | null;

    constructor() {
        this.user = null;
        app.initializeApp(config);
        this.auth = app.auth();
        this.provider = new firebase.auth.GoogleAuthProvider();
        this.isAuthenticated = false;
    }

    loginWithGoogle = () => {
        return new Promise<any>((resolve, reject) => {
            this.auth.signInWithPopup(this.provider)
            .then(async (result: firebase.auth.UserCredential) => {
                const user = result.user;
                this.isAuthenticated = true;
                this.user = user;
                const token = await user?.getIdToken();
                if (token) {
                    window.localStorage.setItem('token', token);
                }

                resolve();
            });
        });  
    }
}

type ContextModel = {
    firebase?: Firebase;
    setUser: (user: any) => void;
    setToken: (string: string) => void;
    token?: string;
    user?: app.User;
}

export const FirebaseContext = React.createContext<ContextModel>({
    setUser: () => {},
    setToken: () => null,
});