import express from "express";
import dotenv from 'dotenv';
import AuthRoutes from "./Routes/Auth/AuthRoutes.js";
import ProblemRoutes from "./Routes/Problem/ProblemRoutes.js";
import ConnectWithDB from "./Utils/Database/db.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(
    cors({
        origin: "http://localhost:3000", // if you want to allow mulitple origin you can pass in the array with comma spearted
        credentials: "true",             // Responding with this header to true means that the server allows cookies (or other user credentials) to be included on cross-origin requests
        methods: ['GET','POST','PATCH'], // Please note methods are not case sensitive
        allowedHeaders: ['Content-Type','Authorization'] //this is case sensitive
    })
)

app.use(express.json()); // this middleware help us to get input in json
app.use(cookieParser()); // here we are initialization of cookie parser using middleware 
app.use(express.urlencoded({extended: true}));

app.use('/api/v2/auth',AuthRoutes);
app.use('/api/v2/problem',ProblemRoutes)

app.get('/happy',(req,res)=>{
    res.status(200).send({
        message: "I am very happpy"
    });
})

ConnectWithDB();

app.listen(process.env.PORT, ()=>{
    console.log("Program started listening on port "+ process.env.PORT);
});