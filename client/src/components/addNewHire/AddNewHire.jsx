import React, {useState} from 'react';
import './addNewHire.css';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddNewHire = () => {
    const newHireinitialValue = {
        firstName: "",
        lastName: "",
        email: "",
        startDate: ""
    }
    const [newHire, setNewHire] = useState(newHireinitialValue);
    const navigate = useNavigate();

    const inputHandler = (e) =>{
        const {name, value} = e.target;
        setNewHire({ ...newHire, [name]:value }) 
        console.log(newHire);
    }

    const submitForm = async(e) => {
        e.preventDefault();
        await axios.post('http://localhost:8000/api/create/newhire', newHire)
        .then((response)=>{
            toast.success(response.data.msg, {position:'top-right'})
            navigate('/')
        }).catch(error => console.log(error));
    }
    return(
        <div className = 'addNewHire'>
            <Link to = '/'>Back</Link>
            <h3>Add New Hire</h3>
            <form className = 'addNewHireForm' onSubmit={submitForm}>
                <div className="inputGroup">
                    <label htmlFor='firstName'> First Name </label>
                    <input type = 'text' onChange = {inputHandler} id = 'firstName' name = 'firstName' autoComplete='off' placeholder='First Name'></input>
                </div>
                <div className="inputGroup">
                    <label htmlFor='lastName'> Last Name </label>
                    <input type = 'text' onChange = {inputHandler} id = 'lastName' name = 'lastName' autoComplete='off' placeholder='Last Name'></input>
                </div>
                <div className="inputGroup">
                    <label htmlFor='email'> Email </label>
                    <input type = 'text' onChange = {inputHandler} id = 'email' name = 'email' autoComplete='off' placeholder='Email'></input>
                </div>
                <div className="inputGroup">
                    <label htmlFor='startDate'> Start Date </label>
                    <input type = 'text' onChange = {inputHandler} id = 'startDate' name = 'startDate' autoComplete='off' placeholder='Start Date'></input>
                </div>
                <div className="inputGroup">
                    <button type = 'submit'>ADD NEW HIRE</button>
                </div>
            </form>
        </div>
    )
}

export default AddNewHire
