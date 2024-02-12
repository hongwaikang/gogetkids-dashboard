'use client'

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  })

  const onLogin = async () => {

  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <hr className="w-full border-t-2 border-gray-300 mb-8" />

      <div className="mb-4">
        <label htmlFor="email" className="text-sm font-semibold">Email</label>
        <input
          id="email"
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Enter email"
          className="border rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="text-sm font-semibold">Password</label>
        <input
          id="password"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Enter password"
          className="border rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        onClick={onLogin}
      >
        Sign Up
      </button>

      <Link className="text-blue-500 hover:underline" href="/signup">
        Visit Sign Up Page
      </Link>

    </div>
  )
}