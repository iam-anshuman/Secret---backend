const Secrets = require('../model/Secrets');

const getSecrets = async (req,res)=>{
    try{
        const securedSecrets = await Secrets.find({});
        const userID = (req.user._id).toString();
        res.status(200).json({securedSecrets,userID});
    }catch(err){
        res.status(500).json(err);
    }
};

const createSecret = async (req,res)=>{
    const body = req.body;
    if(!body.title ||!body.content ){
        return res.status(400).json({error:"Please enter all the fields"});
    }
    try{
        const securedSecrets = await Secrets.create({
            title:body.title,
            content:body.content,
            createdBy:req.user._id
        });
        res.status(200).json({securedSecrets});
    }catch(err){
        res.status(500).json(err);
    }
};

const deleteSecret = async(req,res)=>{
    const id = req.params.id;
    try{
        const secret = await Secrets.findByIdAndDelete(id);
        if(!secret){
            return res.status(404).json({error:"Secret does not exist"});
        }
        res.status(200).json({message:"Secret deleted successfully"});
    }catch(error){
        res.status(500).json(error);
    }
}

module.exports = {getSecrets, createSecret,deleteSecret};