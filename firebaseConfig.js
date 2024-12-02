// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getReactNativePersistence,initializeAuth} from 'firebase/auth'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getFirestore,collection} from 'firebase/firestore'
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAU334ywtLfZim8JYfz3ezJCsJUp1ZjAek",
  authDomain: "reactnativeauthdemo-b2404.firebaseapp.com",
  projectId: "reactnativeauthdemo-b2404",
  storageBucket: "reactnativeauthdemo-b2404.firebasestorage.app",
  messagingSenderId: "42303042406",
  appId: "1:42303042406:web:48b54e7c42bddd0c2f4ea7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app,{
persistence:getReactNativePersistence(AsyncStorage)
});

export const db =getFirestore (app);

export const usersRef = collection (db,"users");
export const roomRef= collection (db,"rooms");
export const bridge = collection(db,"bridge");