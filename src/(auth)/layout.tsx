"use client"
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/router";
import React from "react";

const Layout = 
    //whole layout will be expecting children nodes passed on here
    ({children}: {children: React.ReactNode}) =>
    {
        const {session} = useAuthStore()
        //check if session is not there not
        const router = useRouter()

        React.useEffect(() => {
            if(session) {
                router.push("/")
            }
        }, [session,router])
        //if session exists, redirect to home page

        if(session){
            return null
        }

        return (
            <div className="">
                <div className="">{children}</div>
            </div>

        )
    }




export default Layout;