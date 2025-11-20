import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';

//Route for login

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '3d'});
}

const loginUser = async (req, res) => {
        try{
            const {email, password} = req.body;
            const user = await userModel.findOne({email});
            if(!user){
                return res.json({success: false, message: "User not found"});
            }
            const isMatch = await bcrypt.compare(password, user.password);

            if(isMatch){
                const token = createToken(user._id);
                res.json({success: true, token});
            }
            else{
                res.json({success: false, message: "Invalid credentials"});
            }
            


        }catch(error){
            console.log(error)
            res.json({success: false, message:error.message});
        }
}


//Route for user registration
const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        // checking exist user or not
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false, message: "User already exists"});
        }
        //validating email and strong password
       if(!validator.isEmail(email)){
           return res.json({success:false, message: "Please enter a valid email"});
       }
       if(password.length < 8){
           return res.json({success:false, message: "Password is not strong enough"});
       }
       //hashing password
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);
       //creating new user
       const newUser = new userModel({name, email, password: hashedPassword});
       const user = await newUser.save();

       const token = createToken(user._id);
       
       res.json({success: true, token});


    }catch(error){
        console.log(error)
        res.json({success: false, message:error.message});
    }
}   


//Route for admin login
//Route for admin login
//Route for admin login
const adminLogin = async (req, res) => {
    try{
        const {email, password} = req.body;



        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            // THIS IS THE CRITICAL LINE - make sure it has { email }
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {expiresIn: '3d'});
            res.json({success: true, token});
        }
        else{
            res.json({success: false, message: "You are not authorized to access this"});
        }
    }catch(error){
        console.log(error)
        res.json({success: false, message:error.message});
    }
}




export {loginUser, registerUser, adminLogin} ;
