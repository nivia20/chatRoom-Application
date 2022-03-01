const mongoose = require("mongoose")
const User = mongoose.model("User")
 const jwt = require("jwt-then")
const sha256= require('js-sha256')
exports.register= async (req,res)=>{
    const{name,email,password}=req.body 
    const emailRegex =/@gmail.com|@yahoo.com|@hotmail.com|@live.com/;
    if (!emailRegex.test(email)) throw " email is not supported";
    const userExist = await User.findOne({email});
    if(userExist) throw "User with same email already exist"
    const user= new User({name, email,password:sha256(password + process.env.SALT)});

await user.save();
    res.json({message:"registerd succesfully"})


}
exports.login=async(req,res)=>{
    const {email,password}=req.body;
    const user= await User.findOne({email,password:sha256(password+process.env.SALT)});
    if(!user) throw " Email and password did not match"
    const token =await jwt.sign({id:user.id},process.env.SECRET);
    const userName = user.name
  res.json({
    message: "User logged in successfully!",
    token,
    userName
  });
    //res.json({message:"login succesfully",token})


};