const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const secretRoutes = require("./routes/secret");
const userRoutes = require("./routes/user");
const verifyAuth = require("./middleware/verifyAuth");
require('dotenv').config();

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING).then(()=>{
    console.log("Database connected successfully");
}).catch((err)=>{
    console.log("Error : ",err);
});

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/secrets",verifyAuth,secretRoutes);
app.use("/auth",userRoutes);

app.listen(PORT,()=>{
    console.log("Server is running on port : ", PORT);
});