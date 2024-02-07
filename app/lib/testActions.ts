'use server'

import { Db } from 'mongodb';
import { connect } from './dbConfig';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Define the schema for form data validation using Zod
const studentSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  gender: z.string(), // Gender is required
  dob: z.string(),
  address: z.string(),
  postcode: z.string(),
  zone: z.string().optional(), // Optional field
  class_name: z.string().optional(), // Optional field
  parent_id: z.string().optional(), // Optional field
  status: z.enum(["At Home", "In School", "In Bus", ""]), // Enum for status
  school_name: z.string()
});

// Function to generate a random student ID
function generateStudentId() {
  // Generate a random number between 100000 and 999999
  return Math.floor(Math.random() * 900000) + 100000;
}

// Function to check if the generated student ID is unique
async function isStudentIdUnique(db: Db, studentid: number) {
  const existingStudent = await db.collection('students').findOne({ studentid });
  return !existingStudent;
}

export async function createStudent(formData: FormData) {
  let client;
  try {
    // Validate form data using Zod schema
    const validatedData = studentSchema.parse({
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      gender: formData.get('gender'),
      dob: formData.get('dob'),
      address: formData.get('address'),
      postcode: formData.get('postcode'),
      zone: formData.get('zone') || '',
      class_name: formData.get('class_name') || '',
      parent_id: formData.get('parent_id') || '',
      status: '',
      school_name: ''
    });

    let studentid;
    // Generate a unique student ID
    client = await connect();
    const db = client.db('GoGetKids'); // Specify the database name here
    while (true) {
      studentid = generateStudentId();
      if (await isStudentIdUnique(db, studentid)) {
        break;
      }
    }

    // Insert student data into the MongoDB collection
    const result = await db.collection('students').insertOne({
      studentid,
      ...validatedData,
    });

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('Student created successfully:', result.insertedId);
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during insertion
      console.error('Failed to create student.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating student:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}
