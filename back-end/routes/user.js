const router=require('express').Router();
const {catchErrors}= require("../handlers/errorHandlers")
const userController= require("../controllers/userController")
router.post("/login",catchErrors(userController.login));
const chatroomController = require("../controllers/chatroomController");

router.post("/register",catchErrors(userController.register));
module.exports=router