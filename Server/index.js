const express=require("express");
const dotenv=require("dotenv");
const connectDB = require("./db");
const userRouter=require("./router/userrouter")
const session = require('express-session');
const app=express()

//config
dotenv.config()
app.use(express.json())

//session middleware
app.use(session({
    secret:process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(userRouter)
connectDB()



app.listen(process.env.PORT,()=>{
    console.log("Suceessfully connected")
})