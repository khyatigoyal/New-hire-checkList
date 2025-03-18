import express from "express";
import {login, getUserDetailsByEmail} from "../controller/authController.js";

const authRoute = express.Router();

authRoute.post("/login", login);
authRoute.get("/byEmail/:email", getUserDetailsByEmail);



export default authRoute;
