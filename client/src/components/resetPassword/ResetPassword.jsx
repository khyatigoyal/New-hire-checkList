import React, { useState } from "react";
import {Link,useNavigate} from 'react-router-dom';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import toast from 'react-hot-toast';
const ResetPassword = () => {
    const [userId, setUserId] = useState("");
    const [user, setUser] = useState(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const validatePassword = (password) => {
      const minLength = /.{6,}/;
      const uppercase = /[A-Z]/;
      const lowercase = /[a-z]/;
      const numeric = /[0-9]/;
      const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
      
      if (!minLength.test(password)) return "Password must be at least 6 characters long.";
      if (!uppercase.test(password)) return "Password must contain at least one uppercase letter.";
      if (!lowercase.test(password)) return "Password must contain at least one lowercase letter.";
      if (!numeric.test(password)) return "Password must contain at least one numeric character.";
      if (!specialChar.test(password)) return "Password must contain at least one special character.";
      
      return "";
    };
  
    const checkUserExists = async () => {
      setError("");
      setMessage("");
      
      // Simulating API call
      const response = await fetch(`http://localhost:8000/api/user/byEmail/${userId}`);
      
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        setError(data.error);
        setUser(null);
      }
    };
  
    const handleReset = async () => {
      setError("");
      if (newPassword !== confirmPassword) {
        setError("New password and confirm password do not match.");
        return;
      }
  
      const validationError = validatePassword(newPassword);
      if (validationError) {
        setError(validationError);
        return;
      };
      let updatedUser={
        ...user,
        password: confirmPassword
      }
      await axios.put(`http://localhost:8000/api/update/${user._id}`, updatedUser)
      .then((response)=>{
          toast.success(response.data.msg, {position: 'top-right'})
          navigate('/');
      }).catch(error=>console.log(error))
      setMessage("Password has been successfully reset.");
    };
  
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        
        <div className="card p-4 w-25">
        <Link to = '/'>Back</Link>
          <h2 className="mb-4">Reset Password</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          
          <input
            type="email"
            className="form-control mb-2"
            placeholder="User Email"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled={user!==null && user!==undefined}
          />
          {(user===null || user===undefined) &&<button className="btn btn-secondary mb-3" onClick={checkUserExists}>Check User</button>}
          
          {user!==null && user!==undefined && (
            <>
              <input
                type="password"
                className="form-control mb-2"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <input
                type="password"
                className="form-control mb-2"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                className="form-control mb-2"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button className="btn btn-primary w-100" onClick={handleReset}>Reset Password</button>
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default ResetPassword;