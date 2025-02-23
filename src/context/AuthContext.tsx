import { createContext, ReactNode } from "react";

const AuthContext = createContext(undefined);

export const AuthContextProvider = ({children}: {children: ReactNode}) => {
  return (
    <AuthContext.Provider value={"user"}>
      {children}
    </AuthContext.Provider>
  )
}