// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return <Stack />;
// }
import { Slot, useSegments ,useRouter} from "expo-router";
import React, {useEffect}from "react";
import {View} from  'react-native'
import "../global.css";
import * as SplashScreen from 'expo-splash-screen';
import {AuthContextProvider, useAuth} from '../context/authContext';
import { MenuProvider } from 'react-native-popup-menu'

//SplashScreen.preventAutoHideAsync();
const MainLayout =()=>{
  const {isAuthenticated}=useAuth();
  const segments=useSegments();
   const router = useRouter();
   useEffect(() => {
    // Keep the splash screen visible until the app is ready
    async function prepareApp() {
      try {
        await SplashScreen.preventAutoHideAsync();  // Prevent splash screen from hiding automatically
      } catch (e) {
        console.warn(e);
      }
    }

    prepareApp();

    // Logic to handle redirection based on authentication status
    if (typeof isAuthenticated === 'undefined') return;
  
    const inApp = segments[0] === '(app)';
    if (isAuthenticated && !inApp) {
      // Redirect to dashboard if the user is authenticated
      router.replace('dashboard');
    } else if (isAuthenticated === false) {
      // Redirect to signIn if the user is not authenticated
      router.replace('/signIn');
    }

    // Set timeout to hide splash screen after 3 seconds
    setTimeout(() => {
      SplashScreen.hideAsync(); // Hide splash screen after 3 seconds
    }, 3000);
  }, [isAuthenticated]);

  
  
  // Hide the splash screen when everything is ready
  useEffect(() => {
    return () => {
      SplashScreen.hideAsync(); // Hide splash screen once the app is ready
    };
  }, []);

  return <Slot />;
}

  // useEffect(()=>{
  //     // check if user is authenticated or not
  //     if (typeof isAuthenticated=='undefined') return;
  //     const inApp = segments[0] =='(app)';
  //     if (isAuthenticated && !inApp){
  //       //redirect to home
  //       router.replace('dashboard');
  //     }
  //     else if(isAuthenticated==false){
  //       //redirect to sigIn
  //       router.replace('signIn');
  //     }
  
  //   },[isAuthenticated])

  // return <Slot/>


export default function RootLayout(){
  return (
    <MenuProvider>
    <AuthContextProvider>
        <MainLayout/>
    </AuthContextProvider>
    </MenuProvider>   
   
  ) ; 
}