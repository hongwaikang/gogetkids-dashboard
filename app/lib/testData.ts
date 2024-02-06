import { MongoClient } from 'mongodb';

const ITEMS_PER_PAGE = 6;

// Initialize MongoDB connection
const uri = 'mongodb+srv://systemadmin1:Password123456@cluster0.3fkxfwy.mongodb.net/';
const client = new MongoClient(uri, { useUnifiedTopology: true } as any);

// Connect to MongoDB
async function connect() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

// Disconnect from MongoDB
async function disconnect() {
    try {
        await client.close();
        console.log('Disconnected from MongoDB');
    } catch (err) {
        console.error('Error disconnecting from MongoDB:', err);
    }
}

// Function to fetch filtered students
export async function fetchFilteredStudents(query: string, currentPage: number) {
    const db = client.db('GoGetKids');
    const studentsCollection = db.collection('students');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const students = await studentsCollection
            .find({
                $or: [
                    { firstname: { $regex: query, $options: 'i' } },
                    { lastname: { $regex: query, $options: 'i' } },
                    { class_id: { $regex: query, $options: 'i' } },
                    // Add more fields for filtering if needed
                ]
            })
            .sort({ name: 1 }) // Assuming 'name' field exists for sorting
            .skip(offset)
            .limit(ITEMS_PER_PAGE)
            .toArray();

        return students;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch students.');
    }
}

export async function fetchStudentsPages(query: string) {
  const db = client.db('GoGetKids');
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
  }
}