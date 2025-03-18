import React, { useState,useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate,useLocation } from "react-router-dom";
import {  Tooltip, RadialBarChart, RadialBar, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import NewHiresTable from './components/getAllNewHires/NewHiresTable';
import AddNewHire from './components/addNewHire/AddNewHire';
import EditNewHire from './components/updateNewHire/EditNewHire';
import ResetPassword from './components/resetPassword/ResetPassword';
import toast from 'react-hot-toast';

const Navbar = () => (
  <nav className="navbar navbar-dark bg-primary p-3 d-flex justify-content-between">
    <h1 className="text-white">New Hire Onboarding Trails</h1>
    {sessionStorage.getItem("user")!==null && sessionStorage.getItem("user")!==undefined && <button className="btn btn-light" onClick={() => {sessionStorage.clear();window.location.href = "/"}}>Logout</button>}
  </nav>
);

const Login = ({ setRole }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Add this
  const handleLogin = async () => {
    setError("");
    
    try {

      const response = await fetch("http://localhost:8000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        setRole(data.role);
        sessionStorage.setItem("user", JSON.stringify(data));
        navigate(data.role === "admin" ? "/admin" : "/user",{ state: {user: data, assignedTasks: data.assignedTasks}}); // Redirect based on role
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Failed to connect to the server");
    };

  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="card p-4 w-25 text-center">
        <h2 className="mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Registered email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
        <a href="/reset-password" className="text-primary">Forgot Password?</a>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const location = useLocation();
  const { assignedTasks, user } = location.state || {}; // Handle undefined state
  const [tasks, setTasks] = useState(assignedTasks);
  const [completionPercentage,setCompletionPercentage]=useState(0);
  useEffect(()=>{
    calcStats();
}, [tasks]);
const calcStats = async()=>{
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "Completed").length;
  setCompletionPercentage(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0);
}
  

const taskCompletionData = [
  { name: "Background", value: 100, fill: "#ddd" }, // Full gray background ring
  { name: "Completed", value: completionPercentage, fill: "#4caf50" }, // Green progress ring
];
  // Toggle task status

  const toggleStatus = async (taskId) => {
    let prevTasks=[...tasks];
    prevTasks.forEach(task =>{
      if(task._id === taskId){
        task.status = task.status === "Completed" ? "Pending" : "Completed";
      }
    });
    await setTasks(prevTasks);
    let updatedUser={...user, assignedTasks:prevTasks};
    await updateUser(updatedUser);
  };

  const updateUser = async(updatedUser) => {
    await axios.put(`http://localhost:8000/api/update/${user._id}`, updatedUser)
    .then((response)=>{
        toast.success(response.data.msg, {position: 'top-right'})
    }).catch(error=>console.log(error))
}

  return (
    <div className="container d-flex flex-row align-items-start justify-content-center vh-100 mt-5">
      {/* Circular Progress Chart */}
      <div className="mt-4 me-5" style={{ width: "250px", height: "250px", position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
           <RadialBarChart
            innerRadius="80%"
            outerRadius="100%"
            barSize={15}
            data={taskCompletionData}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar dataKey="value" fill="#4caf50" clockWise />
          </RadialBarChart>
        </ResponsiveContainer>
        <div
          className="position-absolute top-50 start-50 translate-middle"
          style={{ fontSize: "20px", fontWeight: "bold", color: "#4caf50" }}
        >
          {taskCompletionData[1].value.toFixed(2)}%
        </div>
      </div>

      {/* Task Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task._id}>
                <td>{task.task.title}</td>
                <td>{task.task.description}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>
                  <button className={`btn btn-${task.status === "Completed" ? "success" : "warning"}`} onClick={() => toggleStatus(task._id)}>
                    {task.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    )
};

const AdminDashboard = () => {
  const [newHires, setNewHires] = useState([]);
  const [users,setUsers]=useState([]);
  //use effect hook to get all data
       useEffect(()=>{
        fetchData();
    }, []);
  const fetchData = async()=>{
      const response = await axios.get("http://localhost:8000/api/getall/newhires");
      setNewHires(response.data);
      if(response.data!==null && response.data!==undefined && response.data.length!==0) {
        let usersData = [];
        response.data.forEach(element => {
          let total = element.assignedTasks.length;
          let percentCompleted = (element.assignedTasks.filter(r=>r.status!=="Pending").length)/total;
          usersData.push({name : element.firstName + " " + element.lastName, completed: percentCompleted})
        });
        setUsers(usersData);
      }
  }
  return (
  <div className="container mt-4">
    {newHires!==null && newHires!==undefined && newHires.length!==0 && <div>
    <h3 className="mt-4">Progress Comparison</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={users}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="completed" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
    <h2 className="mb-4">User Onboarding</h2>
    
    </div>}
    <NewHiresTable  hires={newHires} refreshHires={fetchData}/>
  </div>
)};

const App = () => {
  const [role, setRole] = useState(null);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login setRole={setRole} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/user" element={role === "user" ? <UserDashboard /> : <Navigate to="/" />} />
        <Route path="/admin" element={role === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/add-new-hire" element={<AddNewHire />} />
        <Route path="/update-new-hire/:id" element={<EditNewHire />} />
      </Routes>
    </Router>
  );
};

export default App;

