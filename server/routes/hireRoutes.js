import express from "express";
import {create, getAll, getOne, update, deleteNewHire} from "../controller/newHireController.js";

const route = express.Router();

route.post("/create/newhire", create);
route.get("/getall/newhires", getAll);
route.get("/getone/:id", getOne);
route.put("/update/:id", update);
route.delete("/delete/:id", deleteNewHire);


export default route;
