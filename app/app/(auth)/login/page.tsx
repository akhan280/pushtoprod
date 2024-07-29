"use client"


import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import LoginButton from "./login-button"
import TwoFactorAuth from "./two-factor"

export default function LoginForm() {

    const [proceed, SetProceed] = useState(false)
    
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
      <div>
        {
            !proceed ? (<LoginButton SetProceed={SetProceed}></LoginButton>): (<TwoFactorAuth/>)
        }
        </div>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  )
}
