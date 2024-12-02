import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Image} from 'expo-image'
import { blurhash, getRoomId } from '../utils/common';
import { usePathname } from 'expo-router';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';



export default function ChatItem({item,router,noBorder,currentUser}) {
    
    const [lastMessage,setLastMessage]=useState(undefined);
    useEffect (()=>{
        
       
        let roomId =getRoomId(currentUser?.userId,item?.userId);
        const docRef =doc(db,"room",roomId);
        const messagesRef =collection (docRef,"messages");
        const q=query(messagesRef,orderBy('createdAt','desc'));
       
        let unsub = onSnapshot(q,(snapshot)=>{
           let allMessages=snapshot.docs.map (doc=>{
           return doc.data();
           }) ;
           setLastMessage(allMessages[0]?allMessages[0]:null);
        });
        return unsub;
       },[]);
    //    console.log('last msg',lastMessage);

const openChatRoom =()=>{
router.push ({pathname: '/chatRoom',params:item});
}

const renderTime = ()=>{

    if(lastMessage){
        console.log('last message time',lastMessage?.createdAt);
    }
    return 'Time';
}

const renderLastMessage =()=>{
   // if(typeof lastMessage == 'undefined') return 'Loading...';
    if (lastMessage){
            if(currentUser?.userId==lastMessage?.userId)
                return "you: "+lastMessage?.text;
                return lastMessage?.text
    }else{
        return 'say hi 👋';
    }
        
    
}


  return (
    <TouchableOpacity onPress={openChatRoom} className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 ${noBorder?'':'border-b border-b-neutral-200'}`}>


         <Image
         style={{height:hp(6),width:hp(6),borderRadius:100}}
         source={{uri: item?.profileUrl || defaultProfileImage}}
         placeholder={blurhash}
         transition={500}
         
         />
         

         {/* name and last message */}
         <View className='flex-1 gap-1'>
            <View className='flex-row justify-between'>
                <Text style={{fontSize:hp(1.8)}} className='font-semibold text-neutral-800'>{item?.username || 'Unknown User'}</Text>
                <Text style={{fontSize:hp(1.4)}} className='font-semibold text-neutral-800'>{renderTime()}</Text>
            </View>
            <Text style={{fontSize:hp(1.6)}} className="font-medium text-neutral-500 ">{renderLastMessage()}</Text>
         </View>

    </TouchableOpacity>
  )
}