import {View,Text,Platform,style} from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import  {blurhash} from '../utils/common';
//import { Image } from 'react-native'; 
 import {useAuth} from '../context/authContext'
 import { MenuItems } from './CustomMenuItems';
 import { AntDesign, Feather, Octicons } from '@expo/vector-icons';
 import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
const ios = Platform.OS=='ios';


export default function DashboardHeader(){
        const {user,logout} = useAuth();
        const defaultProfileImage = 'https://i.pinimg.com/originals/07/33/ba/0733ba760b29378474dea0fdbcb97107.png';
        const {top} =useSafeAreaInsets();
        const handleProfile=()=>{
          console.log('Navigating to Profile');
        } 
        const handleLogout=async()=>{
          try {
            await logout();
            console.log('User logged out');
          } catch (error) {
            console.error('Error during logout:', error);
          }
        }

    // Log the user data to see if profileUrl is available
      console.log('User profile:', user);
    const isValidUrl = user?.profileUrl?.startsWith('http');
      // Image URL for testing
      const imageUrl = isValidUrl ? user.profileUrl : defaultProfileImage;

    return(
        <View style={{paddingTop:ios?top:top+10}} className="flex-row justify-between px-5 bg-indigo-400  pb-6 rounded-b-3xl shadow">
     {/* header title */}
     <View>
     <Text style={{fontSize:hp(3)}} className="font-medium text-white" >Chats</Text>
     </View>
     {/* profile menu */}
     <View>
     <Menu>
      <MenuTrigger>
      
          <Image
            style={{ height: hp(4.3), aspectRatio: 1, borderRadius: 100 }}
            source={{ uri: imageUrl }} // Corrected the image URL handling
           placeholder={blurhash}
           transition={500}
           onError={(error) => {
            // Log if there's an error loading the image
            console.error('Error loading image:', error);
          }}
          />
        
      </MenuTrigger>


      <MenuOptions
      customStyles={{
        optionsContainer:{
          borderRadius:10,
          borderCurve:'continuous',
          marginTop:40,
          marginLeft:-30,
          width:160
          }
      }}
      >
            

        <MenuItems
        text="Profile"
        action={handleProfile}
        value={null}
        icon={ <Feather name="user" size={hp(2.5)} color="black"/> }
        />
        <Divider/>
        <MenuItems
                text="Sign Out"
                action={handleLogout}
                value={null}
                icon={ <AntDesign name="logout" size={hp(2.5)} color="black"/> }
                />
           </MenuOptions>
            </Menu>

                
              </View>
              </View>
            )
        }

        const Divider =()=>{
          return(
          <View className="p-[1px] w-full  bg-neutral-200 "/>

          )
            
          
        }