import NewHire from "../models/newHireModel.js";


export const login = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await NewHire.findOne({email:username, password: password }).populate({
        path: "assignedTasks.task",
        select: "title description", // Fetch only title & description
      })
      .exec(); // Fetch all tasks from master data
      if (user===null || user===undefined) {
        return res.status(401).json({ error: 'Failed to login' });
      }
      
  
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: 'Error in login' });
    }
  };


  export const getUserDetailsByEmail = async (req, res) => {
    try {
      const email = req.params.email;
      const user = await NewHire.findOne({email:email}); // Fetch all tasks from master data
      if (user===null || user===undefined) {
        return res.status(400).json({ error: 'No user found!' });
      }
      
  
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: 'Error in getting user details by email' });
    }
  };