'use server'

import Papa from 'papaparse';
import { connect, disconnect } from './dbConfig';

// ---------------------------------------------- TEACHERS -----------------------------------------------

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
// -------------------------------------------------------------------------------------------------------

// ---------------------------------------------- STUDENTS -----------------------------------------------
interface Student {
  studentid: number | undefined;
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

// Function to generate a random student ID
function generateStudentId(): number {
  // Generate a random number between 100000 and 999999 and convert it to a number
  return Math.floor(Math.random() * 900000) + 100000;
}

// Function to check if the generated student ID is unique
async function isStudentIdUnique(studentid: number): Promise<boolean> {
  const client = await connect();
  const db = client.db('GoGetKids');
  const existingStudent = await db.collection('students').findOne({ studentid });
  await client.close();
  return !existingStudent;
}

export async function parseStudentsJSON(jsonData: any): Promise<Student[]> {
  console.log('Parsing JSON data for students...');
  const parsedStudents: Student[] = JSON.parse(jsonData);
  console.log('JSON parsing complete');
  console.log('Generating and validating student IDs...');
  for (const student of parsedStudents) {
    let isUnique = false;
    let studentid: number | undefined;
    while (!isUnique) {
      studentid = generateStudentId();
      isUnique = await isStudentIdUnique(studentid);
    }
    student.studentid = studentid;
  }
  console.log('Student IDs generated and validated successfully');
  return parsedStudents;
}

export async function parseStudentsCSVToJSON(csvData: string): Promise<Student[]> {
  console.log('Parsing CSV data to JSON...');

  const parsedStudents: Student[] = [];

  const results = Papa.parse(csvData, { header: true });

  if (results && results.data && results.data.length > 0) {
    for (const data of results.data) {
      // Assuming CSV file headers match the Student interface properties
      const { firstname, lastname, gender, address, postcode, dob, zone, parent_id, class_name, school_name } = data as any;
      const student: Student = {
        studentid: undefined, // Placeholder, will be generated later
        firstname: firstname || '',
        lastname: lastname || '',
        gender: gender || '',
        address: address || '',
        postcode: parseInt(postcode) || 0,
        dob: dob || '',
        zone: zone || '',
        parent_id: parent_id || '',
        class_name: class_name || '',
        school_name: school_name || ''
      };
      parsedStudents.push(student);
    }
    console.log('CSV parsing complete');
    console.log('Generating and validating student IDs...');
    for (const student of parsedStudents) {
      let isUnique = false;
      let studentid: number | undefined;
      while (!isUnique) {
        studentid = generateStudentId();
        isUnique = await isStudentIdUnique(studentid);
      }
      student.studentid = studentid;
    }
    console.log('Student IDs generated and validated successfully');
    return parsedStudents;
  } else {
    throw new Error('CSV data is empty or invalid.');
  }
}

export async function insertStudentsFromJSON(parsedStudents: Student[]): Promise<void> {
  console.log('Inserting students into the database...');
  try {
    const client = await connect();
    const database = client.db('GoGetKids');
    const studentsCollection = database.collection('students');
    await studentsCollection.insertMany(parsedStudents);
    console.log('Students inserted successfully');
  } catch (error) {
    console.error('Error inserting students:', error);
    throw error;
  } finally {
    await disconnect();
  }
}
// -------------------------------------------------------------------------------------------------------

// ---------------------------------------------- CLASSES -----------------------------------------------
// Interface for classes
interface Class {
  class_name: string;
  class_level: string;
  teacherid: string;
  school_name: string;
}

// Function to parse JSON data for classes
export async function parseClassesJSON(jsonData: any): Promise<Class[]> {
  console.log('Parsing JSON data for classes...');

  const parsedClasses: Class[] = JSON.parse(jsonData);

  console.log('JSON parsing complete');

  return parsedClasses;
}

// Function to parse CSV data to JSON for classes
export async function parseClassesCSVToJSON(csvData: string): Promise<Class[]> {
  console.log('Parsing CSV data to JSON for classes...');

  const parsedClasses: Class[] = [];

  const results = Papa.parse(csvData, { header: true });

  if (results && results.data && results.data.length > 0) {
    for (const data of results.data) {
      // Assuming CSV file headers match the Class interface properties
      const { class_name, class_level, teacherid, school_name } = data as any;
      const classObj: Class = {
        class_name: class_name || '',
        class_level: class_level || '',
        teacherid: teacherid || '',
        school_name: school_name || ''
      };
      parsedClasses.push(classObj);
    }
    console.log('CSV parsing complete');
    return parsedClasses;
  } else {
    throw new Error('CSV data is empty or invalid.');
  }
}

// Function to insert classes into the database
export async function insertClassesFromJSON(parsedClasses: Class[]): Promise<void> {
  console.log('Inserting classes into the database...');

  try {
    const client = await connect();
    const database = client.db('GoGetKids');
    const classesCollection = database.collection('classes');

    await classesCollection.insertMany(parsedClasses);

    console.log('Classes inserted successfully');
  } catch (error) {
    console.error('Error inserting classes:', error);
    throw error;
  } finally {
    await disconnect();
  }
}
