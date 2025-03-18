import mongoose from 'mongoose';

const newHireSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      default: "abc@123"
    },
    role:{
      type: String,
      required: true,
      default: "user"
    },
    startDate: {
      type: Date,
      required: true,
    },
    assignedTasks: [
      {
        task: { type: mongoose.Schema.Types.ObjectId, ref: "task" },
        dueDate: { type: Date, required: true },
        status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
      },
    ],
  }, { timestamps: true });
  
  const NewHire = mongoose.model('user', newHireSchema);
  
 export default NewHire;