import { View, Text, Pressable,ActivityIndicator } from 'react-native'
import React from 'react'
import { useState,useEffect } from 'react'
import {useAuth} from "../../context/authContext"
import { StatusBar } from 'expo-status-bar';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ChatList from '../../components/ChatList';
import Loading from '../../components/Loading';
import { usersRef } from '../../firebaseConfig';
import { where } from 'firebase/firestore';
import { query } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';


export default function Dashboard() {
  const {logout,user} = useAuth();
  const [users,setUsers]=useState([]);
  useEffect (()=>{
      if (user?.uid) {
        getUsers();
      }
       },[user?.uid])
  
  
  const getUsers = async () => {
    try {
      const q = query(usersRef, where('userId', '!=', user?.uid));
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setUsers(data);
      console.log('Fetched users:', data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  return (
    <View className="flex-1 bg-white">
    <StatusBar style ="light"/>
      
    {
      users.length>0?(
          <ChatList currentUser={user} users={users}/>
      ):(
        <View className="flex items-center" style={{top:hp(30)}}>
          {/* <ActivityIndicator size="large"/> */}
          <Loading size={hp(20)}/>
          
        </View>
      )
    }


    </View>
  )
}