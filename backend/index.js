import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from'dotenv'
import connectDB from './utils/db.js';
import userRoute from './Routes/user.route.js'
import postRoute from './Routes/post.route.js'
import storyRoute from './Routes/storyRoutes.js'
import messageRoute from './Routes/message.route.js'
import { app ,server } from './socket/socket.js';
import path from "path";

dotenv.config({});


const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

//middleware .env password q7rLDcjeWGOnImRK
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true}));
const corsOpions = {
    origin: process.env.URL, 
    credentials: true 
}
app.use(cors(corsOpions));

//Api
app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);
app.use("/api/v1/stories",storyRoute);



app.use(express.static(path.join(__dirname,"/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});


server.listen(PORT,()=>{
    connectDB();
    console.log(`Server is listen at port ${PORT}`);
})