import { View, Text,Image,StyleSheet, TouchableOpacity, Pressable, Alert } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import React,{useRef,useState} from 'react'
import {StatusBar} from 'expo-status-bar'
import { Feather, Octicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import {useAuth} from "../context/authContext"


export default function SignUp() {
  
  const router= useRouter();
  const {register} = useAuth();
  const [loading,setLoading]=useState(false);

  const emailRef =useRef("");
  const passwordRef=useRef("");
  const confirmpasswordRef=useRef("");
  const usernameRef=useRef("");
  const profileRef=useRef("");
 

  // Validate inputs before registration
  const validateInputs = () => {
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !confirmpasswordRef.current ||
      !usernameRef.current ||
      !profileRef.current
    ) {
      Alert.alert('Sign Up', 'Please fill all the fields.');
      return false;
    }

    if (passwordRef.current !== confirmpasswordRef.current) {
      Alert.alert('Sign Up', 'Passwords do not match.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailRef.current)) {
      Alert.alert('Sign Up', 'Please enter a valid email address.');
      return false;
    }

    return true;
  };



  // Handle user registration
  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);

   
      // Check for null or empty values before using them
  if (!emailRef.current || !passwordRef.current || !usernameRef.current || !profileRef.current||!confirmpasswordRef.current ) {
    Alert.alert('Sign Up', 'Please fill in all fields.');

    setLoading(false);
    return;
  }
    try {
       const response = await register(
      emailRef.current,
      passwordRef.current,
      usernameRef.current,
      profileRef.current
    );
    if (response.success) {
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.replace('dashboard') },
      ]);
    } else {
      Alert.alert("Sign Up Error", response.msg || "Something went wrong. Please try again.");
    }
  }
  catch (error) {
    console.error('Error in Registration:', error.message);
    Alert.alert('Sign Up Error', error.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};
  

  return (
    <CustomKeyboardView>
        <StatusBar style="dark"/>
        <View style={{paddingTop:hp (7), paddingHorizontal:wp (5)}}className="flex-1 gap-12">
           {/* signIn image  */}
           <View className="items-center">
            <Image  style={{height:hp(20)}} resizeMode='contain'
             source ={require("../assets/images/login.png")} />
           </View>

<View className ="gap-10">
<Text style={{fontSize:hp(4)}} className ="font-bold tracking-wider text-center text-neutral-800">Sign Up</Text>

{/* inputs */}

<View className="gap-4">
<View style={{height:hp(7)}} className="flex-row gap-4 bg-neutral-100 items-center rounded-xl">
<Feather name ="user" size={hp(2.7)} color ="grey"/>
<TextInput 
onChangeText={value => usernameRef.current=value}
style={{fontSize:hp(2)}} 
className="flex-1 font-semibold text-neutral-700"
placeholder='User Name'
placeholderTextColor={'grey'}
/>
</View>

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
<View style={{height:hp(7)}} className="flex-row gap-4 bg-neutral-100 items-center rounded-xl">
<Octicons name ="lock" size={hp(2.7)} color ="grey"/>
<TextInput 
secureTextEntry
onChangeText={value => confirmpasswordRef.current=value}
style={{fontSize:hp(2)}} 
className="flex-1 font-semibold text-neutral-700"
placeholder='Confirm Password'
placeholderTextColor={'grey'}
/>
</View>

  <View style={{height:hp(7)}} className="flex-row gap-4 bg-neutral-100 items-center rounded-xl">
<Feather name ="image" size={hp(2.7)} color ="grey"/>
<TextInput 
onChangeText={value => profileRef.current=value}
style={{fontSize:hp(2)}} 
className="flex-1 font-semibold text-neutral-700"
placeholder='profile url'
placeholderTextColor={'grey'}
/>    
</View>
 
{/* submit button */}

<View>
  {
    loading?(
<View className="flex-row justify-center">
  <Loading size = {hp(6.5)}/>
</View>
    ):(
      <TouchableOpacity onPress={handleRegister} style = {{height: hp(6.5)}}className="bg-indigo-500 rounded-xl justify-center items-center">
<Text style={{fontSize:hp(2.7)}} className="text-white font-bold tracking-wider" >Sign Up</Text>
  </TouchableOpacity>
 
    )
  }
</View>

  

 {/* signup text */}
    <View  className="flex-row justify-center">
      <Text style={{fontSize:hp(1.8)}} className="font-semibold text-neutral-500">Already have an account?</Text>
      <Pressable onPress={()=>router.push('signIn')}>
        <Text style={{fontSize:hp(1.8)}} className="font-semibold text-indigo-500">Sign In</Text>
      </Pressable>
      
    </View>

        </View>
      </View>
    </View>
    </CustomKeyboardView>
  )
}