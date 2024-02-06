'use server';

import { connect } from '@/app/lib/dbConfig';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Db } from 'mongodb';

// Function to generate a random student ID
function generateStudentId() {
  // Generate a random number between 100000 and 999999
  return Math.floor(Math.random() * 900000) + 100000;
}

async function isStudentIdUnique(db: Db, studentid: number) {
  const existingStudent = await db.collection('students').findOne({ studentid });
  return !existingStudent;
}

export async function createStudent(formData: FormData) {
  try {
    const firstname = formData.get('firstname') || '';
    const lastname = formData.get('lastname') || '';
    const gender = formData.get('gender') || '';
    const dob = formData.get('dob') || '';
    const postcode = formData.get('postcode') || '';
    const zone = formData.get('zone') || '';
    const address = formData.get('address') || '';
    const parent_id = formData.get('parent_id') || '';
    const class_name = formData.get('class_name') || '';

    const status = '';
    const school_name = '';

    let studentid;
    // Generate a unique student ID
    while (true) {
      studentid = generateStudentId();
      const client = await connect();
      const db = client.db();
      if (await isStudentIdUnique(db, studentid)) {
        break;
      }
    }

    // Connect to MongoDB
    const client = await connect();
    const db = client.db(); // Access the database from the client

    // Insert student data into the MongoDB collection
    const result = await db.collection('students').insertOne({
      studentid,
      firstname,
      lastname,
      gender,
      dob,
      status,
      postcode,
      zone,
      address,
      parent_id,
      school_name,
      class_name,
    });

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('Student created successfully:', result.insertedId);
    } else {
      // Error occurred during insertion
      console.error('Failed to create student.');
    }

    // Refresh data and redirect back to the students page
    revalidatePath('/dashboard/students');
    redirect('/dashboard/students');

      } catch (error: any) {
        // Handle validation or database insertion errors
        console.error('Error creating student:', error.message);
        // Optionally, you can redirect to an error page or display an error message to the user
      }
}
