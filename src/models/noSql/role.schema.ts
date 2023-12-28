import mongoose from 'mongoose';
const { Schema } = mongoose;

export const roleSchema = new Schema({
  role: {
    type: String,
    unique: true,
  },
});
