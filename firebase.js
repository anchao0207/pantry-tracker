// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqNAnaV4B43Alj_u7qwSMbDAPj1oZ72JI",
  authDomain: "pantry-tracker-8efff.firebaseapp.com",
  projectId: "pantry-tracker-8efff",
  storageBucket: "pantry-tracker-8efff.appspot.com",
  messagingSenderId: "1082446391157",
  appId: "1:1082446391157:web:a53f58143b54e32167d53c",
  measurementId: "G-MZ5P19E5FV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };
