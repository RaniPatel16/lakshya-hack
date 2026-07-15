import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  skillsOffered: {
    type: [String],
    default: [],
  },
  skillsWanted: {
    type: [String],
    default: [],
  },
  level: {
    type: Number,
    default: 1,
  },
  xp: {
    type: Number,
    default: 0,
  },
  isPublic: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;
