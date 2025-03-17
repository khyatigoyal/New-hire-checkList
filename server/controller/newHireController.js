import NewHire from "../models/newHireModel.js"
import Tasklist from "../models/taskListModel.js";

// Create a constant tasklist that all new hires will get
const constantTasklist = {
    title: 'Onboarding Tasks',
    tasks: [
      {
        description: 'Complete HR documentation',
        dueDate: new Date('2025-03-20'),
        status: 'Pending',
      },
      {
        description: 'Setup work email and tools',
        dueDate: new Date('2025-03-21'),
        status: 'Pending',
      },
      {
        description: 'Attend orientation session',
        dueDate: new Date('2025-03-22'),
        status: 'Pending',
      },
    ],
  };


// Create a new hire and assign the constant tasklist
export const create = async (req, res) => {
    try {
      const { firstName, lastName, email, startDate } = req.body;
  
      // Step 1: Save the new hire
      const newHire = new NewHire({
        firstName,
        lastName,
        email,
        startDate,
      });
      const savedHire = await newHire.save();
  
      // Step 2: Create or fetch the constant tasklist
      let tasklist = await Tasklist.findOne({ title: constantTasklist.title });
  
      if (!tasklist) {
        tasklist = new Tasklist(constantTasklist);
        await tasklist.save();
      }
  
      // Step 3: Assign the tasklist to the new hire
      savedHire.assignedTasks.push(tasklist._id);
      await savedHire.save();
  
      res.status(201).json({ newHire: savedHire, tasklist, msg:"New Hire created successfully" });
    } catch (error) {
      res.status(400).json({ error: 'Error creating new hire and assigning tasklist' });
    }
  };
  
  // Get all new hires along with their assigned tasks
  export const getAll = async (req, res) => {
    try {
      const hires = await NewHire.find().populate('assignedTasks');
      res.status(200).json(hires);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching new hires' });
    }
  };

  //API to get one record
export const getOne = async(req, res) => {
    try{
        const id = req.params.id;
        const newHireExists = await NewHire.findById(id);
        if(!newHireExists){
            return res.status(404).json({
                msg: "New Hire with the given id not found"
            });
        }
        res.status(200).json(newHireExists);
    } catch(error){
        res.status(500).json({error:error});
    }
}

//API to update user
export const update = async(req, res) => {
    try{
        const id = req.params.id;
        const newHireExists = await NewHire.findById(id);
        if(!newHireExists){
            return res.status(404).json({
                msg: "User with the given id not found"
            });
        }
        const updatedData = await NewHire.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json({msg:"User updated successfully"});
    } catch(error){
        res.status(500).json({error:error});
    }
}

//API to delete newhire
export const deleteNewHire = async(req, res) => {
    try{
        const id = req.params.id;
        const newHireExists = await NewHire.findById(id);
        if(!newHireExists){
            return res.status(404).json({
                msg: "User with the given id not found"
            });
        }
        await NewHire.findByIdAndDelete(id);
        res.status(200).json({
            msg: "User deleted successfully"
        });
    } catch(error){
        res.status(500).json({error:error});
    }
}
  