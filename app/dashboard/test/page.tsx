// @/app/dashboard/test/page.tsx:
"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";

export default function TestPage() {
  const [schoolName, setSchoolName] = useState("No school name");

  const getSchoolName = async () => {
    try {
      const res = await axios.get('/api/dashboard/test');
      console.log(res.data);
      setSchoolName(res.data.data.schoolName);
    } catch (error: any) {
      console.error(error.message);
      // Handle errors if necessary
    }
  };

  useEffect(() => {
    getSchoolName();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-white">
      <h1 className="text-4xl font-bold mb-4 text-blue-600">Test Page</h1>
      <div className="bg-white p-6 rounded-md shadow-md text-center">
        <p className="text-gray-700">Welcome to the test page!</p>
        <hr className="my-4 border-t border-gray-300" />
        <div className="bg-blue-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2 text-blue-600">
            {schoolName === 'No school name' ? "No School Name" : "Your School:"}
          </h2>
          <p className="text-gray-800">
            {schoolName}
          </p>
        </div>
      </div>
    </div>
  );
}
