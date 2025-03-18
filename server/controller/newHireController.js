import NewHire from "../models/newHireModel.js"
import Task from "../models/taskListModel.js";

// Create a constant tasklist that all new hires will get
const constantTaskList = [
      {
        title:'HR documentation',
        description: 'Complete Code of Conduct',
      },
      {
        title:'Work Portal',
        description: 'Setup work email and tools',
      },
      {
        title:'Functional Onboarding',
        description: 'Attend orientation session',
      },
    ]


// Create a new hire and assign the constant tasklist
export const create = async (req, res) => {
    try {
      const { firstName, lastName, email, startDate } = req.body;
      let tasks = await Task.find(); // Fetch all tasks from master data
      if (tasks===null || tasks===undefined || tasks.length===0) {
        tasks = await Task.insertMany(constantTaskList);
      }
      const assignedTasks = tasks.map((task) => ({
        task: task._id,
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days later
        status: "Pending",
      }));
      // Step 1: Save the new hire
      const newHire = new NewHire({
        firstName,
        lastName,
        email,
        startDate,
        assignedTasks: assignedTasks
      });
      await newHire.save();
  
      res.status(200).json({ newHire: newHire, msg:"New Hire created successfully" });
    } catch (error) {
      res.status(400).json({ error: 'Error creating new hire and assigning tasklist' });
    }
  };
  
  // Get all new hires along with their assigned tasks
  export const getAll = async (req, res) => {
    try {
      const hires = await NewHire.find({role:"user"}).populate({
        path: "assignedTasks.task",
        select: "title description", // Fetch only title & description
      })
      .exec();
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
  