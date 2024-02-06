import { connect } from './dbConfig';

const ITEMS_PER_PAGE = 6;

// Students
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
        const count = await studentsCollection.countDocuments({
            $or: [
                { firstname: { $regex: query, $options: 'i' } },
                { lastname: { $regex: query, $options: 'i' } },
                { class_id: { $regex: query, $options: 'i' } },
                // Add more fields for filtering if needed
            ]
        });

        const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of students.');
    } finally {
        await client.close(); // Close the connection when done
    }
}

// Parents
export async function fetchFilteredParents(query: string, currentPage: number) {
    const client = await connect();
    const db = client.db('GoGetKids'); // Access the database from the client instance
    const parentsCollection = db.collection('users');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const students = await parentsCollection
            .find({
							role: 'parent',
            })
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

// Teachers
export async function fetchFilteredTeachers(query: string, currentPage: number) {
	const client = await connect();
	const db = client.db('GoGetKids'); // Access the database from the client instance
	const teachersCollection = db.collection('users');

	const offset = (currentPage - 1) * ITEMS_PER_PAGE;

	try {
			const students = await teachersCollection
					.find({
						role: 'teacher',
					})
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

// Classes
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