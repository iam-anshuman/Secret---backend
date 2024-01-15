const jwt = require("jsonwebtoken");
const users = require("../model/users");


const verifyAuth = async (req,res,next)=>{
    const {authorization} = req.headers;
    // console.log(authorization);
    if(!authorization){
        return res.status(401).json({message:"Authorization is required"});
    }
    const token = authorization.split(" ")[1];
    try {

        const {_id} = jwt.verify((JSON.parse(token).token), process.env.SECRET_JWT);
        req.user = await users.findById(_id).select("_id");
        next();

    } catch (error) {
        res.status(401).json({message:"Request unauthorized"});
    }
}

module.exports = verifyAuth;