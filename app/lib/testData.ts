import { connect } from './dbConfig';

const ITEMS_PER_PAGE = 6;

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
    const client = await connect();
    const db = client.db('GoGetKids'); // Access the database from the client instance
    const studentsCollection = db.collection('students');

    try {
        const count = await studentsCollection.countDocuments();

        const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of students.');
    } finally {
        await client.close(); // Close the connection when done
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
	const client = await connect();
	const db = client.db('GoGetKids'); // Access the database from the client instance
	const parentsCollection = db.collection('users');

	try {
			const count = await parentsCollection.countDocuments({
					role: 'parent',
			});

			const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
			return totalPages;
	} catch (error) {
			console.error('Database Error:', error);
			throw new Error('Failed to fetch total number of parents.');
	} finally {
			await client.close(); // Close the connection when done
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
	const client = await connect();
	const db = client.db('GoGetKids'); // Access the database from the client instance
	const parentsCollection = db.collection('users');

	try {
			const count = await parentsCollection.countDocuments({
					role: 'teacher',
			});

			const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
			return totalPages;
	} catch (error) {
			console.error('Database Error:', error);
			throw new Error('Failed to fetch total number of teachers.');
	} finally {
			await client.close(); // Close the connection when done
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
	const client = await connect();
	const db = client.db('GoGetKids'); // Access the database from the client instance
	const classesCollection = db.collection('classes');

	try {
			const count = await classesCollection.countDocuments();

			const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
			return totalPages;
	} catch (error) {
			console.error('Database Error:', error);
			throw new Error('Failed to fetch total number of classes.');
	} finally {
			await client.close(); // Close the connection when done
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
// ------------------------------------------------------------------------------------------------------