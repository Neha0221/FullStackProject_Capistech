const bcrypt=require('bcrypt');
const User=require('../model/userModel');
const jwt = require("jsonwebtoken");

const userRegister=async (req,res)=>{
    try{
        const {name,email,password}=req.body;
    
        if(!name || !email || !password){
            return res.status(400).send('All fields are required');
        }

        const existUser=await User.findOne({email});
        if(existUser){
            return res.status(400).send('User already exist');
        }

        const hashPassword=await bcrypt.hash(password,10);

        const newUser=await User.create({
            name,
            email,
            password: hashPassword
        })

        res.status(201).json({message:'User Register Sucessfully'});
    }

    catch(err){
        res.status(500).json({message:err.message});
    }
}

const userLogin=async (req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).send('Email and password are required');
        }

        const user=await User.findOne({email});
        if(!user){
            res.status(400).send('Invalid email or password');
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(400).send('Invalid email or password');
        }

        const token=jwt.sign({id: user._id},process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            message:'Login Successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

module.exports={userRegister,userLogin}