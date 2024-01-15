const users = require("../model/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
require('dotenv').config();


const createToken = (_id)=>{
    return jwt.sign({_id},process.env.SECRET_JWT,{expiresIn:"2d"});
}

const login = async (req,res)=>{ 
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"Please enter all the fields"});
    }

    if(!validator.isEmail(email)){
        return res.status(400).json({message:"Please enter a valid email"});
    }

    try {
        const user = await users.findOne({email:email});
        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const token = createToken(user._id);
        res.status(200).json({email,token:token});

    } catch (error) {
        console.log(error);
    }

}

const signup = async (req,res)=>{
    const {fullname,email,password} = req.body;

    if(!fullname || !email || !password){
        return res.status(400).json({message:"Please enter all the fields"});
    }

    if(!validator.isEmail(email)){
        return res.status(400).json({message:"Please enter a valid email"});
    }

    try {
        const user = await users.findOne({email:email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new users({
            fullname:fullname,
            email:email,
            password:hashedPassword
        });
        const savedUser = await newUser.save();
        const token = createToken(savedUser._id);
        res.status(200).json({email,token:token});
    } catch (error) {
        console.log(error);
    }
}

module.exports = {login,signup};
