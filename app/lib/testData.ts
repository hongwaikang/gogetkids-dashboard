import { connect, disconnect } from './dbConfig';
import { Db, ObjectId } from 'mongodb';

const ITEMS_PER_PAGE = 6;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// ---------------------------------------------- STUDENTS ----------------------------------------------
export async function fetchFilteredStudents(query: string, currentPage: number) {
    const client = await connect();
    const db = client.db('GoGetKids'); // Access the database from the client instance
    const studentsCollection = db.collection('students');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const students = await studentsCollection
            .find()
            .sort({ name: 1 }) // Assuming 'name' field exists for sorting
            .skip(offset)
            .limit(ITEMS_PER_PAGE)
            .toArray();

        return students;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch students.');
    } finally {
        await client.close(); // Close the connection when done
    }
}

export async function fetchStudentsPages(query: string) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
      try {
          const client = await connect();
          const db = client.db('GoGetKids'); // Access the database from the client instance
          const studentsCollection = db.collection('students');

          const count = await studentsCollection.countDocuments();

          const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
          return totalPages;
      } catch (error) {
          console.error('Error fetching students:', error);
          retries++;
          if (retries < MAX_RETRIES) {
              console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
          } else {
              console.error('Max retries exceeded. Failed to fetch total number of students.');
              throw new Error('Failed to fetch total number of students.');
          }
      }
  }
}

export async function fetchStudentById(id: ObjectId) {
  let client;
  let db: Db | undefined;
  try {
    client = await connect();
    db = client.db('GoGetKids'); // Connect to the 'GoGetKids' database

    const student = await db.collection('students').findOne({ _id: id });

    if (student) {
      console.log('Fetched student:', student); // Log the fetched student object
      return student;
    } else {
      throw new Error('Student not found.');
    }
  } catch (error: any) {
    console.error('Error fetching student:', error.message);
    throw new Error('Failed to fetch student.');
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// ------------------------------------------------------------------------------------------------------

// ---------------------------------------------- PARENTS -----------------------------------------------
export async function fetchFilteredParents(query: string, currentPage: number) {
    const client = await connect();
    const db = client.db('GoGetKids'); // Access the database from the client instance
    const parentsCollection = db.collection('users');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const parents = await parentsCollection
            .find({
							role: 'parent',
            })
            .sort({ name: 1 })
            .skip(offset)
            .limit(ITEMS_PER_PAGE)
            .toArray();

        return parents;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch parents.');
    } finally {
        await client.close(); // Close the connection when done
    }
}

export async function fetchParentsPages(query: string) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
      try {
          const client = await connect();
          const db = client.db('GoGetKids'); // Access the database from the client instance
          const parentsCollection = db.collection('users');

          const count = await parentsCollection.countDocuments({ role: 'parent' });

          const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
          return totalPages;
      } catch (error) {
          console.error('Error fetching parents:', error);
          retries++;
          if (retries < MAX_RETRIES) {
              console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
          } else {
              console.error('Max retries exceeded. Failed to fetch total number of parents.');
              throw new Error('Failed to fetch total number of parents.');
          }
      }
  }
}

// Update this to take in school prop
export async function fetchAllParentsEmail() {
	const client = await connect();
	const db = client.db('GoGetKids'); // Access the database from the client instance
	const parentsCollection = db.collection('users');

	try {
			const parentsEmails = await parentsCollection
					.find({ role: 'parent' })
					.project({ _id: 0, email: 1 }) // Projection to include only the email field
					.toArray();

			return parentsEmails.map(parent => parent.email);
	} catch (error) {
			console.error('Database Error:', error);
			throw new Error('Failed to fetch parents emails.');
	} finally {
			await client.close(); // Close the connection when done
	}
}

export async function fetchParentById(id: ObjectId) {
  let client;
  let db: Db | undefined;
  try {
    client = await connect();
    db = client.db('GoGetKids'); // Connect to the 'GoGetKids' database

    const parent = await db.collection('users').findOne({ _id: id, role: 'parent' });

    if (parent) {
      console.log('Fetched parent:', parent); // Log the fetched parent object
      return parent;
    } else {
      throw new Error('Parent not found.');
    }
  } catch (error: any) {
    console.error('Error fetching parent:', error.message);
    throw new Error('Failed to fetch parent.');
  } finally {
    if (client) {
      await client.close();
    }
  }
}
// ------------------------------------------------------------------------------------------------------

// ---------------------------------------------- TEACHERS ----------------------------------------------
export async function fetchFilteredTeachers(query: string, currentPage: number) {
	const client = await connect();
	const db = client.db('GoGetKids'); // Access the database from the client instance
	const teachersCollection = db.collection('users');

	const offset = (currentPage - 1) * ITEMS_PER_PAGE;

	try {
			const teachers = await teachersCollection
					.find({
						role: 'teacher',
					})
					.sort({ name: 1 }) // Assuming 'name' field exists for sorting
					.skip(offset)
					.limit(ITEMS_PER_PAGE)
					.toArray();

			return teachers;
	} catch (error) {
			console.error('Database Error:', error);
			throw new Error('Failed to fetch teachers.');
	} finally {
			await client.close(); // Close the connection when done
	}
}

export async function fetchTeachersPages(query: string) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
      try {
          const client = await connect();
          const db = client.db('GoGetKids'); // Access the database from the client instance
          const teachersCollection = db.collection('users');

          const count = await teachersCollection.countDocuments({ role: 'teacher' });

          const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
          return totalPages;
      } catch (error) {
          console.error('Error fetching teachers:', error);
          retries++;
          if (retries < MAX_RETRIES) {
              console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
          } else {
              console.error('Max retries exceeded. Failed to fetch total number of teachers.');
              throw new Error('Failed to fetch total number of teachers.');
          }
      }
  }
}

export async function fetchAllTeachersEmail() {
  const client = await connect();
  const db = client.db('GoGetKids'); // Access the database from the client instance
  const teachersCollection = db.collection('users');

  try {
    const teachersEmails = await teachersCollection
      .find({ role: 'teacher' }) // Adjust the role to search for teachers
      .project({ _id: 0, email: 1 }) // Projection to include only the email field
      .toArray();

    return teachersEmails.map(teacher => teacher.email);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch teachers emails.');
  } finally {
    await client.close(); // Close the connection when done
  }
}

export async function fetchTeacherById(id: ObjectId) {
  let client;
  let db: Db | undefined;
  try {
    client = await connect();
    db = client.db('GoGetKids');

    // Fetch teacher data based on ID and role
    const teacher = await db.collection('users').findOne({ _id: id, role: 'teacher' });

    if (teacher) {
      console.log('Fetched teacher:', teacher);
      return teacher;
    } else {
      throw new Error('Teacher not found.');
    }
  } catch (error: any) {
    console.error('Error fetching teacher:', error.message);
    throw new Error('Failed to fetch teacher.');
  } finally {
    if (client) {
      await client.close();
    }
  }
}
// ------------------------------------------------------------------------------------------------------

// ---------------------------------------------- CLASSES -----------------------------------------------
export async function fetchFilteredClasses(query: string, currentPage: number) {
	const client = await connect();
	const db = client.db('GoGetKids'); // Access the database from the client instance
	const teachersCollection = db.collection('classes');

	const offset = (currentPage - 1) * ITEMS_PER_PAGE;

	//TO DO find school id
	try {
			const students = await teachersCollection
					.find()
					.sort({ name: 1 }) // Assuming 'name' field exists for sorting
					.skip(offset)
					.limit(ITEMS_PER_PAGE)
					.toArray();

			return students;
	} catch (error) {
			console.error('Database Error:', error);
			throw new Error('Failed to fetch students.');
	} finally {
			await client.close(); // Close the connection when done
	}
}

export async function fetchClassesPages(query: string) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
      try {
          const client = await connect();
          const db = client.db('GoGetKids'); // Access the database from the client instance
          const classesCollection = db.collection('classes');

          const count = await classesCollection.countDocuments();

          const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
          return totalPages;
      } catch (error) {
          console.error('Error fetching classes:', error);
          retries++;
          if (retries < MAX_RETRIES) {
              console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
          } else {
              console.error('Max retries exceeded. Failed to fetch total number of classes.');
              throw new Error('Failed to fetch total number of classes.');
          }
      }
  }
}

// Update this to take in school prop
export async function fetchAllClassNames() {
  const client = await connect();
  const db = client.db('GoGetKids'); // Access the database from the client instance
  const classesCollection = db.collection('classes');

  try {
    const classNames = await classesCollection
      .find({})
      .project({ _id: 0, class_name: 1 }) // Projection to include only the class_name field
      .toArray();

    return classNames.map(clazz => clazz.class_name);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch class names.');
  } finally {
    await client.close(); // Close the connection when done
  }
}

export async function fetchClassById(id: ObjectId) {
  let client;
  let db: Db | undefined;
  try {
    client = await connect();
    db = client.db('GoGetKids');

    // Fetch class data based on ID
    const classroom = await db.collection('classes').findOne({ _id: id });

    if (classroom) {
      console.log('Fetched class:', classroom);
      return classroom;
    } else {
      throw new Error('Class not found.');
    }
  } catch (error: any) {
    console.error('Error fetching class:', error.message);
    throw new Error('Failed to fetch class.');
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// ------------------------------------------------------------------------------------------------------