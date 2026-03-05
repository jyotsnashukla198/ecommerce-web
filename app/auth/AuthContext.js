"use client";

import {createContext, useContext,useEffect,useState} from "react";
const AuthContext = createContext(null);

export function AuthProvider({children}){
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        fetch("/api/auth/me").then((res)=>res.json)
        .then((data)=>{
          setUser(data.user);
          setLoading(false);
        })
    },[]);

    return(
        <AuthContext.provider value={{user,setUser,loading}}>
            {children}
        </AuthContext.provider>
    )
}