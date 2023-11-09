// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBEpON-_D3ZMZQig7EM3H33gVaMnNlFzSI",
    authDomain: "testdatabase-4e6f9.firebaseapp.com",
    projectId: "testdatabase-4e6f9",
    storageBucket: "testdatabase-4e6f9.appspot.com",
    messagingSenderId: "153333233280",
    appId: "1:153333233280:web:e9d8ea5dcc44fdb7025865",
    measurementId: "G-7CF819JPQ7"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore()
