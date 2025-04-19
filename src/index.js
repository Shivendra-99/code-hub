import express from "express";
import dotenv from 'dotenv';
import AuthRoutes from "./Routes/Auth/AuthRoutes.js";
import ConnectWithDB from "./Utils/Database/db.js";

dotenv.config();

const app = express();

app.get('/api/v2/',AuthRoutes);

app.get('/happy',(req,res)=>{
    res.status(200).send({
        message: "I am very happpy"
    });
})

ConnectWithDB();

app.listen(process.env.PORT, ()=>{
    console.log("Program started listening on port "+ process.env.PORT);
});