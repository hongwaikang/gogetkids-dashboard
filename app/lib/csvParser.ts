// csvParser.ts
import Papa from 'papaparse';

export async function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          reject(result.errors[0].message);
        } else {
          resolve(result.data);
        }
      },
      error: (error) => {
        reject(error.message);
      },
    });
  });
}
