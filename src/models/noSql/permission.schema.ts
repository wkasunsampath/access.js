import mongoose from 'mongoose';
const { Schema } = mongoose;

export const permissionSchema = new Schema({
  permission: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
});
