import mongoose from 'mongoose';
const { Schema } = mongoose;

const roleUserSchema = new Schema({
  role: {
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

roleUserSchema.index({ role: 1, user: 1 }, { unique: true });
export default roleUserSchema;
