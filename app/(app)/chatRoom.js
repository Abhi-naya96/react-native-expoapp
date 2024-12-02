import { View, Text,TextInput, TouchableOpacity,Alert, Keyboard } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React ,{useEffect, useState,useRef} from 'react'
import { StatusBar } from 'expo-status-bar';
import ChatRoomHeader from '../../components/ChatRoomHeader';
import MessageList from '../../components/MessageList';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import CustomKeyboardView from '../../components/CustomKeyboardView';
import { getRoomId } from '../../utils/common';
import { addDoc, doc, onSnapshot, setDoc, Timestamp,query,orderBy,collection, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/authContext';



export default function ChatRoom() {
const item=useLocalSearchParams();
const {user}=useAuth();//loggedin user
const router=useRouter();
const [messages,setMessages]=useState([]);
const textRef =useRef('');

const inputRef =useRef(null);
const scrollViewRef =useRef(null);
useEffect (()=>{
 createRoomIfNotExists();

 let roomId =getRoomId(user?.userId,item?.userId);
 const docRef =doc(db,"room",roomId);
 const messagesRef =collection (docRef,"messages");
 const q=query(messagesRef,orderBy('createdAt','asc'));

 let unsub = onSnapshot(q,(snapshot)=>{
    let allMessages=snapshot.docs.map (doc=>{
    return doc.data();
    }) ;
    setMessages([...allMessages]);
 });

const KeyboardDidShowListener =Keyboard .addListener(
    'keyboardDidShow',updateScrollView
)

 return ()=> {
    unsub();
    KeyboardDidShowListener.remove();
 }


},[]);



useEffect(()=>{
    updateScrollView();
},[messages])

const updateScrollView=()=>{
    setTimeout (()=> {
        scrollViewRef?.current?.scrollToEnd({animated:true})
    },100)
}



const createRoomIfNotExists = async () => {
    // Generate roomId
    let roomId = getRoomId(user?.userId, item?.userId);

    // Reference to the room document
    const roomRef = doc(db, 'rooms', roomId);

    try {
        // Check if the room already exists
        const roomSnapshot = await getDoc(roomRef);

        if (!roomSnapshot.exists()) {
            // If the room does not exist, create it
            await setDoc(roomRef, {
                roomId,
                createdAt: Timestamp.fromDate(new Date())
            });
            console.log(`Room ${roomId} created successfully.`);
        } else {
            console.log(`Room ${roomId} already exists.`);
        }
    } catch (error) {
        console.error("Error creating room:", error);
    }
};




const handleSendMessage = async () => {
    const message = textRef?.current?.trim();
    if (!message) {
        console.warn("Message is empty.");
        return;
    }

    try {
        const roomId = getRoomId(user?.userId, item?.userId);
        if (!roomId) {
            console.error("Invalid roomId.");
            return;
        }

        const docRef = doc(db, 'rooms', roomId);
        const messagesRef = collection(docRef, "messages");

        const newDoc = await addDoc(messagesRef, {
            userId: user?.userId,
            text: message,
            profileUrl: user?.profileUrl,
            senderName: user?.username,
            createdAt: Timestamp.fromDate(new Date())
        });

        console.log("Message sent successfully:", newDoc.id);

        // Clear the input
        if (textRef?.current) textRef.current.valueOf = "";
        if (inputRef?.current) inputRef.current.clear();
    } catch (error) {
        console.error("Error sending message:", error.code, error.message, error);
    }
};





return (
    <CustomKeyboardView inChat={true}>
    <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar style='dark'/>
        <ChatRoomHeader user={item} router={router}/>
        <View style={{ height: 3, borderBottomWidth: 1, borderBottomColor: '#a9a9a9' }} />
      <View className='flex-1 justify-between bg-neutral-100 overflow-visible'>
        <View className='flex-1'>
            <MessageList scrollViewRef ={scrollViewRef}messages={messages} currentUser={user}
            />
        </View>
        <View style={{marginBottom:hp(1.7)}}className='pt-2'>
            
               <View className='flex-row mx-3 justify-between bg-white border p-2 border-neutral-300 rounded-full pl-5'>
                <TextInput 
                onChange={value =>textRef.current =value}
                placeholder='Type Message....'
                style={{fontSize:hp(2)}}
                className='flex-1 mr-2'
                />
                <TouchableOpacity  onPress={handleSendMessage} className='bg-neutral-200 p-2 mr-[1px] rounded-full'>
                    <Feather name="send" size={hp(2.7)} color='green'/>
                </TouchableOpacity>
                </View> 
            
        </View>
      </View>
    </View>
    </CustomKeyboardView>
  )
}