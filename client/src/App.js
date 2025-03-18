import React, { useState,useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import NewHiresTable from './components/getAllNewHires/NewHiresTable';
import AddNewHire from './components/addNewHire/AddNewHire';
import EditNewHire from './components/updateNewHire/EditNewHire';
import ResetPassword from './components/resetPassword/ResetPassword';
const tasks = [
  { name: "Completed", value: 6, color: "#4caf50" },
  { name: "Pending", value: 3, color: "#ff9800" },
  { name: "Optional", value: 1, color: "#2196f3" },
];

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
        navigate(data.role === "admin" ? "/admin" : "/user"); // Redirect based on role
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

const UserDashboard = () => (
  <div className="mt-4">
    <h2 className="mb-4">Task Progress</h2>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={tasks} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
          {tasks.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

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

