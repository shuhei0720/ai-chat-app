"use client"
import { auth } from "@/lib/firebase/firebaseClient";
import { UserInfo } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextState {
  currentUser: UserInfo | null
}
const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthContextProvider = ({children}: {children: ReactNode}) => {
const[currentUser,setCurrentUser] = useState<UserInfo | null>(null);
const[isLoading,setIsLoading] = useState(true);

useEffect(() => {
  const unsubscribe = auth.onIdTokenChanged((user) => {
    if(user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
    setIsLoading(false);
  })
  return () => unsubscribe();
},[]);

  return (
    <AuthContext.Provider value={{currentUser}}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}