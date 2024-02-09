'use server'

import Papa from 'papaparse';
import { connect, disconnect } from './dbConfig';
import { ObjectId } from 'mongodb';

interface Teacher {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNum: string;
  role: string;
  school_name: string;
}

export async function parseTeachersJSON(jsonData: any): Promise<Teacher[]> {
  console.log('Parsing JSON data...');

  const parsedTeachers: Teacher[] = JSON.parse(jsonData);

  console.log('JSON parsing complete');

  return parsedTeachers;
}

export async function parseTeachersCSVToJSON(csvData: string): Promise<Teacher[]> {
  console.log('Parsing CSV data to JSON...');

  const parsedTeachers: Teacher[] = [];

  const results = Papa.parse(csvData, { header: true });

  if (results && results.data && results.data.length > 0) {
    for (const data of results.data) {
      // Assuming CSV file headers match the Teacher interface properties
      const { email, firstName, lastName, password, phoneNum, role, school_name } = data as any;
      const teacher: Teacher = {
        email: email || '',
        firstName: firstName || '',
        lastName: lastName || '',
        password: password || '',
        phoneNum: phoneNum || '',
        role: role || '',
        school_name: school_name || ''
      };
      parsedTeachers.push(teacher);
    }
    console.log('CSV parsing complete');
    return parsedTeachers;
  } else {
    throw new Error('CSV data is empty or invalid.');
  }
}

export async function insertTeachersFromJSON(parsedTeachers: Teacher[]): Promise<void> {
  console.log('Inserting teachers into the database...');

  try {
    const client = await connect();
    const database = client.db('GoGetKids');
    const teachersCollection = database.collection('users');

    await teachersCollection.insertMany(parsedTeachers.map(teacher => ({
      ...teacher,
      role: 'teacher', // Add role field with value 'teacher'
    })));

    console.log('Teachers inserted successfully');
  } catch (error) {
    console.error('Error inserting teachers:', error);
    throw error;
  } finally {
    await disconnect();
  }
}

// Students
interface Student {
  studentid: number; // We'll leave it empty initially
  firstname: string;
  lastname: string;
  gender: string;
  address: string;
  postcode: number;
  dob: string;
  zone: string;
  parent_id: string;
  class_name: string;
  school_name: string;
}

export async function parseStudentsJSON(jsonData: any): Promise<Student[]> {
  console.log('Parsing JSON data for students...');

  const parsedStudents: Student[] = JSON.parse(jsonData);

  console.log('JSON parsing complete');

  return parsedStudents;
}

function generateStudentId(): number {
  // Generate a random number between 100000 and 999999 and convert it to a number
  return Math.floor(Math.random() * 900000) + 100000;
}

async function isStudentIdUnique(studentid: number): Promise<boolean> {
  const client = await connect();
  const db = client.db('GoGetKids');
  const existingStudent = await db.collection('students').findOne({ studentid });
  await client.close();
  return !existingStudent;
}

export async function insertStudentsFromJSON(parsedStudents: any[]): Promise<void> {
  console.log('Inserting students into the database...');

  const client = await connect();
  const database = client.db('GoGetKids');
  const studentsCollection = database.collection('students');

  try {
    for (const parsedStudent of parsedStudents) {
      let student_id;
      let isUnique = false;
      while (!isUnique) {
        student_id = generateStudentId();
        isUnique = await isStudentIdUnique(student_id);
      }
      // Replace the empty studentid with the generated unique one
      parsedStudent.studentid = student_id;
      // Insert the parsed student object with the updated studentid into the database
      await studentsCollection.insertOne(parsedStudent);
    }

    console.log('Students inserted successfully');
  } catch (error) {
    console.error('Error inserting students:', error);
    throw error;
  } finally {
    await disconnect();
  }
}
