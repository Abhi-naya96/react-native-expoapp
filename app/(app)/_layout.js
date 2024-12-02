import { View, Text } from 'react-native'
import React from 'react'
import {Stack} from 'expo-router'
import DashboardHeader from '../../components/DashboardHeader'

export default function _layout() {
  return (
   <Stack>
    <Stack.Screen
     name="dashboard"
    options={{
      header:()=><DashboardHeader/>

    }}
/>

   
   </Stack>
  )
}