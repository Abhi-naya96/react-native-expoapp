//import undefined from "@/app-example/components/ui/TabBarBackground";
import {createContext,useEffect,useState,useContext} from "react";
 import {onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,sendPasswordResetEmail} from 'firebase/auth'
 import {auth , db} from "../firebaseConfig"
 import {doc,setDoc,getDoc} from 'firebase/firestore'
 

export const AuthContext = createContext();

export const AuthContextProvider =({children})=>{
    const [user,setUser]=useState(null);
    const [isAuthenticated,setIsAuthenticated]=useState(undefined);

    useEffect (()=>{
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
            if(user) {
                setUser(user);
                setIsAuthenticated(true);
                updateUserData (user.uid);
            }else {
                setUser(null);
                setIsAuthenticated(false);
               
            }
        });
        return unsubscribe;
    },[]);

    const updateUserData= async (userId)=>{
        const docRef =doc (db,'users',userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()){
            let data = docSnap.data();
            setUser({...user,username:data.username,profileUrl:data.profileUrl,userId:data.userId})
        }
    }
    
    const login = async (email,password)=>{
        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
        }
        catch(e){
      let msg = e.message;
      if (msg.includes("(auth/user-not-found)")) msg = "User not found";
      if (msg.includes("(auth/wrong-password)")) msg = "Incorrect password";
      return { success: false, msg };
                
        }
    };
    const logout = async ()=>{
        try{
            await auth.signOut();
            setUser(null);
            setIsAuthenticated(false);
        }catch(e){
            console.error("Logout error:", e.message);    
        }
    };
    
    const register = async (email,password,username, profileUrl)=>{
        try{
            const response=await  createUserWithEmailAndPassword (auth,email,password);
           // const userId = response.user.uid;
           const user = response.user; // Extract user object
            // console.log('response.user:',response?.user) 
            await setDoc(doc(db, 'users', user.uid), {
                username,
                profileUrl,
                userId: user.uid,
              });
        return {success:true};
        }catch(e){
            let msg = e.message;
      if (msg.includes("(auth/email-already-in-use)")) msg = "Email already in use";
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("(auth/weak-password)")) msg = "Weak password";
      return { success: false, msg };
        }
    };
    return(
        <AuthContext.Provider value={{user,isAuthenticated,login,register,logout}}>{children}</AuthContext.Provider>
    );
};

export const useAuth=()=>{
    const value =useContext (AuthContext);

    if (!value){
        throw new Error ('useAuth must be wrapped inside AuthContextProvider');
    }
    return value;
};
