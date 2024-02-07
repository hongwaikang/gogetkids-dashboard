import { ObjectId } from 'mongodb';

export interface Student {
  _id: ObjectId; // Update _id to be of type ObjectId
  studentid: number;
  firstname: string;
  lastname: string;
  gender: string;
  dob: string; // Assuming dob is a string representing date
  address: string;
  postcode: string;
  zone?: string; // Optional property
  class_name: string;
  parent_id?: string;
  status?: string; // Optional property
}
