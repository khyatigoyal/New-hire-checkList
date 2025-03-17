import mongoose from 'mongoose';

const newHireSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    assignedTasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tasklist',
    }],
  }, { timestamps: true });
  
  const NewHire = mongoose.model('newHire', newHireSchema);
  
 export default NewHire;