'use server'

import { Db, ObjectId } from 'mongodb';
import { connect } from './dbConfig';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// For password hashing
const bcrypt = require('bcrypt');
const saltRounds = 10; // Adjust the number of salt rounds as needed

// ---------------------------------------------- STUDENTS ----------------------------------------------
// Define the schema for form data validation using Zod
const studentSchema = z.object({
  studentid: z.number(),
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

function generateStudentId() {
  // Generate a random number between 100000 and 999999 and convert it to a number
  return +Math.floor(Math.random() * 900000) + 100000;
}

// Function to check if the generated student ID is unique
async function isStudentIdUnique(db: Db, studentid: number) {
  const existingStudent = await db.collection('students').findOne({ studentid });
  return !existingStudent;
}

export async function createStudent(formData: FormData) {
  let client;
  try {
    // Generate a unique student ID
    let studentid;
    client = await connect();
    const db = client.db('GoGetKids');
    let isUnique = false;
    while (!isUnique) {
      studentid = generateStudentId();
      isUnique = await isStudentIdUnique(db, studentid);
    }

    // Validate form data using Zod schema
    const validatedData = {
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
    };

    // Manually add studentid to the data object
    const studentData = {
      studentid,
      ...validatedData,
    };

    // Insert student data into the MongoDB collection
    const result = await db.collection('students').insertOne(studentData);

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('Student created successfully:', result.insertedId);
      revalidatePath('/dashboard/students')
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

export async function updateStudent(id: string, formData: FormData) {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    // Explicitly convert studentid to a number
    const studentId = Number(formData.get('studentid'));

    // Validate form data using Zod schema
    const validatedData = studentSchema.parse({
      studentid: studentId,
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

    console.log('Validated Data:', validatedData); // Log validated data

    client = await connect();
    console.log('Connected to MongoDB'); // Log successful connection

    const db = client.db('GoGetKids'); // Specify the database name here

    // Update student data in the MongoDB collection
    const result = await db.collection('students').updateOne(
      { _id: objectId }, // Use the ObjectId here
      { $set: validatedData }
    );

    console.log('Update Result:', result); // Log update result

    // Check if the update was successful
    if (result.modifiedCount === 1) {
      // Data updated successfully
      console.log('Student updated successfully:', id);
      revalidatePath('/dashboard/students');
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during update
      console.error('Failed to update student.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database update errors
    console.error('Error updating student:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed'); // Log when the connection is closed
    }
  }
}


// ------------------------------------------------------------------------------------------------------

// ---------------------------------------------- PARENTS -----------------------------------------------
// Define the schema for parent data validation using Zod
const parentSchema = z.object({
  email: z.string().email(), // Email is required and must be a valid email format
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(), // Password is required
  phoneNum: z.string(),
  role: z.enum(["parent"]), // Role must be "parent"
});

export async function createParent(formData: FormData) {
  let client;
  let db: Db; // Declare db variable here
  try {
    // Validate form data using Zod schema
    const validatedData = parentSchema.parse({
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      password: formData.get('password'),
      phoneNum: formData.get('phoneNum'),
      role: 'parent', // Hardcoded role as "parent"
    });

    // Check if the email is unique
    client = await connect();
    db = client.db('GoGetKids'); // Specify the database name here
    const existingParent = await db.collection('users').findOne({ email: validatedData.email });
    if (existingParent) {
      throw new Error('Email is already in use.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds); // Use bcrypt to hash the password with 10 salt rounds

    // Insert parent data into the MongoDB collection with hashed password
    const result = await db.collection('users').insertOne({
      ...validatedData,
      password: hashedPassword, // Replace plain password with hashed password
    });

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('Parent created successfully:', result.insertedId);
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during insertion
      console.error('Failed to create parent.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating parent:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}
// ------------------------------------------------------------------------------------------------------

// ---------------------------------------------- TEACHERS ----------------------------------------------
// Define the schema for teacher data validation using Zod
const teacherSchema = z.object({
  email: z.string().email(), // Email is required and must be a valid email format
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(), // Password is required
  phoneNum: z.string(),
  role: z.enum(["teacher"]), // Role must be "teacher"
  school_name: z.string(),
});

export async function createTeacher(formData: FormData) {
  let client;
  let db: Db; // Declare db variable here
  try {
    // Validate form data using Zod schema
    const validatedData = teacherSchema.parse({
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      password: formData.get('password'),
      phoneNum: formData.get('phoneNum'),
      role: 'teacher', // Hardcoded role as "teacher"
      school_name: '',
    });

    // Check if the email is unique
    client = await connect();
    db = client.db('GoGetKids'); // Specify the database name here
    const existingTeacher = await db.collection('users').findOne({ email: validatedData.email });
    if (existingTeacher) {
      throw new Error('Email is already in use.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds); // Use bcrypt to hash the password with 10 salt rounds

    // Insert teacher data into the MongoDB collection with hashed password
    const result = await db.collection('users').insertOne({
      ...validatedData,
      password: hashedPassword, // Replace plain password with hashed password
    });

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('Teacher created successfully:', result.insertedId);
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during insertion
      console.error('Failed to create teacher.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating teacher:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}
// ------------------------------------------------------------------------------------------------------

// ---------------------------------------------- CLASSES ----------------------------------------------
// Define the schema for class data validation using Zod
const classSchema = z.object({
  class_name: z.string(), // Class name is required
  class_level: z.string(), // Class level is required
  teacherid: z.string(), // Teacher ID is required
  school_name: z.string(), // School name is required
});

export async function createClass(formData: FormData) {
  let client;
  let db: Db; // Declare db variable here
  try {
    // Validate form data using Zod schema
    const validatedData = classSchema.parse({
      class_name: formData.get('class_name'),
      class_level: formData.get('class_level'),
      teacherid: formData.get('teacher_email'),
      school_name: '',
    });

    // Additional validation steps if necessary

    // Connect to the MongoDB database
    client = await connect();
    db = client.db('GoGetKids'); // Specify the database name here

    // Insert class data into the MongoDB collection
    const result = await db.collection('classes').insertOne(validatedData);

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('Class created successfully:', result.insertedId);
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during insertion
      console.error('Failed to create class.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating class:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}