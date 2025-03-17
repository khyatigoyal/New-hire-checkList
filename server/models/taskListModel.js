import mongoose from 'mongoose';

const tasklistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tasks: [{
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
  }],
}, { timestamps: true });

const Tasklist = mongoose.model('Tasklist', tasklistSchema);

export default Tasklist;