import { View, Text,Image,StyleSheet, TouchableOpacity, Pressable, Alert,Platform, Button } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import React,{useState,useRef} from 'react'
import {StatusBar} from 'expo-status-bar'
import { Octicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';
import{sendPasswordResetEmail,signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../firebaseConfig';



export default function SignIn() {
  const router= useRouter();
  const { login } = useAuth();
  const [loading,setLoading]=useState(false);

  const emailRef =useRef("");
  const passwordRef=useRef("");

// Handle forgot password
const handleForgotPassword = async () => {
  if (!emailRef.current) {
    Alert.alert("Enter Email", "Please enter your email to reset your password.");
    return;
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

  if (!isValidEmail(emailRef.current)) {
    Alert.alert("Invalid Email", "Please enter a valid email address.");
    return;
  }

  try {
    // Send the reset email
    await sendPasswordResetEmail(auth, emailRef.current);
    Alert.alert(
      "Reset Email Sent",
      `A password reset email has been sent to ${emailRef.current}. Please check your inbox.`,
      [{ text: "OK" }]
    );
  } catch (error) {
    console.error("Error sending reset email:", error);
  let errorMessage = "An error occurred.";
  if (error.code === "auth/missing-email") {
    errorMessage = "Email address is missing.";
  } else if (error.code === "auth/invalid-email") {
    errorMessage = "Invalid email address.";
  } else if (error.code === "auth/user-not-found") {
    errorMessage = "No user found with this email address.";
  }
    Alert.alert("Error", errorMessage);
  }

}


  const handleLogin =async ()=> {
    if (loading) return; // Prevent duplicate logins
  setLoading(true);
    if (!emailRef.current || !passwordRef.current){
      Alert.alert('Sign In',"Please fill all the fields");
      setLoading(false);
      return;
    }
    try {
    const response = await login(emailRef.current, passwordRef.current);
    if (response.success) {
      Alert.alert("Success", "Logged in successfully!", [
        { text: "OK", onPress: () => router.push("dashboard") },
      ]);
    } else {
      Alert.alert("Sign In Error", response.msg || "Something went wrong.");
    }
  } catch (error) {
    console.error("Login Error:", error);
  } finally {
    setLoading(false);
  }
};
//login process
  
  return (
    <CustomKeyboardView>
        <StatusBar style="dark"/>
        <View style={{paddingTop:hp (8), paddingHorizontal:wp (5)}}className="flex-1 gap-12">
           {/* signIn image  */}
           <View className="items-center">
            <Image  style={{height:hp(25)}} resizeMode='contain'
             source ={require("../assets/images/login.png")} />
           </View>

<View className ="gap-10">
<Text style={{fontSize:hp(4)}} className ="font-bold tracking-wider text-center text-neutral-800">Sign In</Text>
{/* inputs */}
<View className="gap-4">
<View style={{height:hp(7)}} className="flex-row gap-4 bg-neutral-100 items-center rounded-xl">
<Octicons name ="mail" size={hp(2.7)} color ="grey"/>
<TextInput 
onChangeText={value => emailRef.current=value}
style={{fontSize:hp(2)}} 
className="flex-1 font-semibold text-neutral-700"
placeholder='Email address'
placeholderTextColor={'grey'}
/>
</View>
<View className="gap-3" >
  <View style={{height:hp(7)}} className="flex-row gap-4 bg-neutral-100 items-center rounded-xl">
<Octicons name ="lock" size={hp(2.7)} color ="grey"/>
<TextInput 
secureTextEntry
onChangeText={value => passwordRef.current=value}
style={{fontSize:hp(2)}} 
className="flex-1 font-semibold text-neutral-700"
placeholder='Password'
placeholderTextColor={'grey'}
/>    
  </View>
  <Text onPress={handleForgotPassword} style={{fontSize:hp(1.8)}}className="font-semibold text-right text-neutral-500">Forgot Password?</Text>
  </View>
{/* submit button */}

<View>
  {
    loading?(
<View className="flex-row justify-center">
  <Loading size = {hp(10)}/>
</View>
    ):(
      <TouchableOpacity onPress={handleLogin} style = {{height: hp(6.5)}}className="bg-indigo-500 rounded-xl justify-center items-center">
<Text style={{fontSize:hp(2.7)}} className="text-white font-bold tracking-wider" >Sign In</Text>
  </TouchableOpacity>
 
    )
  }
</View>

  

 {/* signup text */}
    <View  className="flex-row justify-center">
      <Text style={{fontSize:hp(1.8)}} className="font-semibold text-neutral-500">New to TalKY ?</Text>
      <Pressable onPress={()=>router.push('signUp')}>
        <Text style={{fontSize:hp(1.8)}} className="font-semibold text-indigo-500">SignUp</Text>
      </Pressable>
      
    </View>

        </View>
      </View>
    </View>
    </CustomKeyboardView>
    
  )
}