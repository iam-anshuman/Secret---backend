const user = require("../model/users");
const jwt = require("jsonwebtoken");
const {mailer} = require("../utils/mailsender");
const bcrypt = require("bcryptjs");

const handleForgetPassword = async (req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.status(400).json({message:"Please enter the email"});
    }
    try{
        const userDetail = await user.findOne({email});
        if(!userDetail){
            return res.status(400).json({message:"User does not exist"});
        }

        const secret = userDetail.password + userDetail._id  + userDetail.createdAt;

        const token = jwt.sign({id:userDetail._id},secret,{expiresIn:"15m"});
        const link = `http://localhost:8080/auth/reset-password/${userDetail._id}/${token}`;

        res.status(200).json({message:"Email sent successfully"});
        mailer(email,link);

    }catch(err){
        res.status(500).json(err);
    }
}


const handlResetLink = async(req,res)=>{
    const {id,token} = req.params;
    if(!id || !token ){
        return res.status(400).json({message:"Invalid Attempt"});
    }
    try{
        const userDetail = await user.findById(id);
        if(!userDetail){
            return res.status(400).json({message:"User does not exist"});
        }
        const secret = userDetail.password + userDetail._id  + userDetail.createdAt;
        const payload = jwt.verify(token,secret);
        if(!payload){
            return res.status(400).json({message:"Invalid token"});
        }
        res.render('ResetForm');

    }catch(err){
        res.status(500).json(err);
    }
}

const handleSetNewPassword = async(req,res)=>{
    const {id,token} = req.params;
    const {password,confirmPassword} = req.body;
    
    if(!id || !token || !password|| !confirmPassword){
        return res.status(400).json({message:"Invalid Attempt"});
    }
    try{
        const userDetail = await user.findById(id);
        if(!userDetail){
            return res.status(400).json({message:"User does not exist"});
        }
        const secret = userDetail.password + userDetail._id  + userDetail.createdAt;
        const payload = jwt.verify(token,secret);
        if(!payload){
            return res.status(400).json({message:"Invalid token"});
        }
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,salt);

        const response = await user.findByIdAndUpdate(id,{password:hashedPassword});
        // console.log(response);
        res.status(200).json({message:"Password updated successfully"});

    }catch(err){
        res.status(500).json(err);
    }

}

module.exports = {handleForgetPassword,handlResetLink,handleSetNewPassword};