"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useState } from "react"
import Image from "next/image"
import { ENV } from "../../lib/config/env";

const API_ENDPOINT = ENV.API_ENDPOINT;

export default function SignInPage() {
  const [username, setUsername] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
		
		
    try {
      const response = await fetch(`${API_ENDPOINT}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      })

      if (response.ok) {
        const data = await response.json()
				console.log("Sign-in successful", data)
        // Set a cookie for 1 day
        Cookies.set("authToken", data.access_token, { expires: 1 })
        router.push("/")
      } else {
        console.error("Sign-in failed", await response.json())
      }
    } catch (error) {
      console.error("An error occurred during sign-in", error)
    }
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#1e3330]">
      {/* 
        Mobile: Top section with rounded bottom corners
        Tablet: Top section with rounded bottom corners
        Small Desktop (1024px-1439px): Right side with percentage width and rounded left corners
        Large Desktop (1440px+): Right side with exact width and rounded left corners
      */}
      <div
        className="bg-[#2d6a4f] h-[362px] rounded-b-[36px] 
           lg:h-full lg:w-[40%] lg:rounded-none lg:rounded-l-[36px] lg:absolute lg:right-0
           xl:w-[45%]
           2xl:w-[632px]
           flex items-center justify-center"
      >
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex flex-col items-center">
          <Image
            src="/placeholder.svg?height=400&width=400"
            alt="Notebook illustration"
            width={400}
            height={400}
            className="object-contain"
          />
          <p className="text-white text-2xl italic mt-2">a Board</p>
        </div>
      </div>

      {/* 
        Mobile: Bottom section
        Tablet: Bottom section
        Small Desktop (1024px-1439px): Left side with percentage width
        Large Desktop (1440px+): Left side with exact width
      */}
      <div
        className="flex flex-col justify-center px-6 py-12 md:py-16 md:px-12 
           lg:h-full lg:w-[60%] lg:absolute lg:left-0
           xl:w-[55%]
           2xl:w-[808px]"
      >
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-white text-3xl font-medium mb-8">Sign in</h1>

          <form onSubmit={handleSubmit} className="w-full">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-md mb-4 text-gray-800"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-[#4CAF82] hover:bg-[#3d8c68] text-white py-3 rounded-md transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Bottom indicator line (mobile only) */}
        <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto mt-auto md:hidden fixed bottom-5 left-1/2 transform -translate-x-1/2"></div>
      </div>
    </div>
  )
}
