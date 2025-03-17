import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import route from './routes/hireRoutes.js';

const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 7000;
const URL = process.env.MONGOURL;

mongoose.connect(URL).then(()=>{
    console.log('DB connectedly successfully!');
    app.listen(PORT, ()=>{
        console.log(`Server is running on PORT: ${PORT}`);
    })
}).catch(error => console.log(error));

// Routes
app.use('/api', route);
