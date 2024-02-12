"use client";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function UserProfile() {

  const router = useRouter();

  const logout = async () => {
    try {
      await axios.get('/api/users/logout')
      toast.success('Logout successful')
      router.push('/login')
    } catch (error: any) {
        console.log(error.message)
        toast.error('Logout failed')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <hr className="border-t border-gray-300 w-full mb-4" />
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <p className="text-xl mb-2">Welcome to your profile!</p>
      </div>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
        onClick={logout}>
          Logout
      </button>
    </div>

  );
}
