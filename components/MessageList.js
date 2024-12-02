import { View, Text } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { ScrollView } from 'react-native'
import MessageItem from './MessageItem'

export default function MessageList({messages,scrollViewRef,currentUser}) {
  return (
    <ScrollView  ref= {scrollViewRef}showsVerticalScrollIndicator ={false}
    contentContainerStyle={{paddingTop:1}}>
       {
        messages.map((message,index)=>{
return (
    <MessageItem message={message} key={index} currentUser={currentUser}/>

)
        })
       }
    </ScrollView>
)
}