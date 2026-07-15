import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  skillOffered: {
    type: String,
    required: true,
  },
  skillWanted: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending',
  },
  message: {
    type: String,
    default: '',
  },
  aiMatchScore: {
    type: Number,
  }
}, {
  timestamps: true,
});

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);
export default SwapRequest;
