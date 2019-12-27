import React from 'react';
import app from 'firebase/app';
import firebase from 'firebase';
import 'firebase/auth';

export const config = {
    apiKey: 'AIzaSyB8LGR1HsQj3EXI4DGF4N-tXKD8yIDFhv0',
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
    public user: any;

    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.provider = new firebase.auth.GoogleAuthProvider();
        this.isAuthenticated = false;
    }

    loginWithGoogle = () => {
        return new Promise<any>((resolve, reject) => {
            this.auth.signInWithPopup(this.provider)
            .then((result: any) => {
                const user = result.user;
                this.isAuthenticated = true;
                this.user = user;
                resolve();
            });
        });  
    }
}

type ContextModel = {
    firebase?: Firebase;
    setUser: (user: any) => void;
    user?: any;
}

export const FirebaseContext = React.createContext<ContextModel>({
    setUser: () => {}
});