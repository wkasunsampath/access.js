import mongoose from 'mongoose';
const { Schema } = mongoose;

const permissionUserSchema = new Schema({
  permission: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    index: true,
  },
});

permissionUserSchema.index({ permission: 1, user: 1 }, { unique: true });
export default permissionUserSchema;
