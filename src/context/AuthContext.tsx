"use client"
import { auth } from "@/lib/firebase/firebaseClient";
import { UserInfo } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export const AuthContextProvider = ({children}: {children: ReactNode}) => {
const[currentUser,setCurrentUser] = useState<UserInfo | null>(null);

useEffect(() => {
  const unsubscribe = auth.onIdTokenChanged((user) => {
    if(user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  })
  return () => unsubscribe();
},[]);

  return (
    <AuthContext.Provider value={currentUser}>
      {children}
    </AuthContext.Provider>
  )
}