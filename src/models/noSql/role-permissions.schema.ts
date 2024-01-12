import mongoose from 'mongoose';
const { Schema } = mongoose;

const rolePermissionsSchema = new Schema({
  role: {
    type: String,
    required: true,
    index: true,
  },
  permission: {
    type: String,
    required: true,
    index: true,
  },
});

rolePermissionsSchema.index({ role: 1, permission: 1 }, { unique: true });
export default rolePermissionsSchema;
