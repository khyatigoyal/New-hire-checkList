import React, {useEffect, useState} from 'react';
import './newHiresTable.css';
import {Link} from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const NewHiresTable = ()=>{
    const [newHires, setNewHires] = useState([]);

     //use effect hook to get all data
     useEffect(()=>{
        const fetchData = async()=>{
            const response = await axios.get("http://localhost:8000/api/getall/newhires");
            setNewHires(response.data)
        }
        fetchData();
    }, [])

    const deleteNewHire = async (newHireId) =>{
        await axios.delete(`http://localhost:8000/api/delete/${newHireId}`)
        .then((response)=>{
            setNewHires((prevData)=>prevData.filter((user)=>user._id!==newHireId))
            toast.success(response.data.msg, {position:'top-right'})
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    return(
        <div className = 'new-hires-table'> 
            <Link to='/add-new-hire' className = 'addButton'> Add New Hire</Link>
            <table border ={1} cellPadding={10} cellSpacing={0}>
                <thead>
                    <tr>
                        <th> S.No </th>
                        <th> Name </th>
                        <th> Email </th>
                        <th> Start Date </th>
                        <th> Actions </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        newHires.map((newHire,index)=>{
                            return(
                                <tr key = {newHire._id}>
                                    <td> {index+1} </td>
                                    <td> {newHire.firstName} {newHire.lastName} </td>
                                    <td> {newHire.email} </td>
                                    <td> {newHire.startDate} </td>
                                    <td className = 'actionButtons'> 
                                        <button onClick={()=>deleteNewHire(newHire._id)}><i className="fa-solid fa-trash"></i></button>
                                        <Link to ={`/update-new-hire/`+newHire._id}><i className="fa-solid fa-pen-to-square"></i></Link>
                                    </td>
                                 </tr>
                            )
                        })
                    }
                    
                </tbody>
            </table>
        </div>
    )
}

export default NewHiresTable