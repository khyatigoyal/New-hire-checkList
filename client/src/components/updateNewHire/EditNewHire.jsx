import React, {useState, useEffect} from 'react';
import {Link,useParams, useNavigate} from 'react-router-dom';
import '../addNewHire/addNewHire.css';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditNewHire = () => {

    const newHires = {
        firstName: "",
        lastName: "",
        email: "",
        startDate:""
    }

    const {id} = useParams();
    const navigate = useNavigate();
    const [newHire, setNewHire] = useState(newHires);

    const inputChangeHandler = (e) => { 
        const {name, value} = e.target;
        setNewHire({...newHire, [name]:value});
        console.log(newHire);
    }
     
    useEffect(()=>{
        axios.get(`http://localhost:8000/api/getone/${id}`)
        .then((response)=>{
            setNewHire(response.data)

        })
        .catch((error)=>{
            console.log(error);
        })
    }, [id])

    const submitForm = async(e) => {
        e.preventDefault();
        await axios.put(`http://localhost:8000/api/update/${id}`, newHire)
        .then((response)=>{
            toast.success(response.data.msg, {position: 'top-right'})
            navigate('/admin');
        }).catch(error=>console.log(error))
    }

    return(
        <div className = 'addNewHire'>
            <Link to = '/admin'>Back</Link>
            <h3>Update New Hire</h3>
            <form className = 'addNewHireForm' onSubmit={submitForm}>
                <div className="inputGroup">
                    <label htmlFor='firstName'> First Name </label>
                    <input type = 'text' value = {newHire.firstName} onChange = {inputChangeHandler} id = 'firstName' name = 'firstName' autoComplete='off' placeholder='First Name'></input>
                </div>
                <div className="inputGroup">
                    <label htmlFor='lastName'> Last Name </label>
                    <input type = 'text' value = {newHire.lastName} onChange = {inputChangeHandler} id = 'lastName' name = 'lastName' autoComplete='off' placeholder='Last Name'></input>
                </div>
                <div className="inputGroup">
                    <label htmlFor='email'> Email </label>
                    <input type = 'email' value = {newHire.email} onChange = {inputChangeHandler} id = 'email' name = 'email' autoComplete='off' placeholder='Email'></input>
                </div>
                <div className="inputGroup">
                    <label htmlFor='startDate'> Start Date </label>
                    <input type = 'date' value={newHire.startDate ? new Date(newHire.startDate).toISOString().split('T')[0] : ''} onChange = {inputChangeHandler} id = 'startDate' name = 'startDate' autoComplete='off' placeholder='Start Date'></input>
                </div>
                <div className="inputGroup">
                    <button type = 'submit'>UPDATE NEW HIRE</button>
                </div>
            </form>
        </div>
    )
}

export default EditNewHire