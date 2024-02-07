'use server'

import { connect } from './dbConfig';
import { z } from 'zod';
import { Db } from 'mongodb';

// Define the schema for form data validation using Zod
const studentSchema = z.object({
  firstname: z.string().nonempty(),
  lastname: z.string().nonempty(),
  gender: z.string(), // Gender is required
  dob: z.string().nonempty(),
  address: z.string().nonempty(),
  postcode: z.string().nonempty(),
  zone: z.string().optional(), // Optional field
  class_name: z.string().optional(), // Optional field
  parent_id: z.string().optional(), // Optional field
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
  try {
    // Validate form data using Zod schema
    const validatedData = studentSchema.parse({
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      gender: formData.get('gender'),
      dob: formData.get('dob'),
      address: formData.get('address'),
      postcode: formData.get('postcode'),
      zone: formData.get('zone'),
      class_name: formData.get('class_name'),
      parent_id: formData.get('parent_id'),
    });

    let studentid;
    // Generate a unique student ID
    const client = await connect();
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
    } else {
      // Error occurred during insertion
      console.error('Failed to create student.');
    }

    // Close the connection
    await client.close();
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating student:', error.message);
    // Optionally, redirect to an error page or display an error message to the user
  }
}
