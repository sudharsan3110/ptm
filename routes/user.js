import express from 'express';
import zod from "zod";
import jwt from "jsonwebtoken";
import JWT_SECRET from '../config.js';
const router = express.Router();
import  db from "../db.js"
import authMiddleWare from "../middleware.js";


const {User} = db;



const signupBody = zod.object({
   userName: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string()
})
const signInBody = zod.object({
   username: zod.string().email(),
   password: zod.string()
})

const updateBody = zod.object({
   password: zod.string().optional(),
   firstname: zod.string().optional(),
   lastname:zod.string().optional()
})
   router.post("/signup", async (req, res) => {
      const { success } = signupBody.safeParse(req.body)
  
      console.log(success )
      console.log(req.body)
      if (!success){
          return res.status(411).json({
              message: "Email already taken / sign up failed. "
          })
      }
  
      const existingUser = await User.findOne({
          username: req.body.username
      })
  
      if (existingUser) {
          return res.status(411).json({
              message: "Email already taken/Incorrect inputs"
          })
      }
  
      const user = await User.create({
          username: req.body.username,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
      })
      const userId = user._id;
  
      await Account.create({
          userId,
          balance: 1 + Math.random() * 10000
      })
  
      const token = jwt.sign({
          userId
      }, JWT_SECRET);
  
      res.json({
          message: "User created successfully",
          token: token
      })
  })

router.post("/sigin",async(req,res)=>{
   const {success} = signInBody.safeParse(req.body);
   if(!success) return res.status(411).json({
      message: "Invalid login"
   })

   const user = await user.findOne({
      username: req.body.username,
      password: req.body.password
   })
   if(user){
      const token = jwt.sign({
         userId: user._id
      },JWT_SECRET)
      res.json({
         token:token
      })
   return}
   res.status
   (411).json({
      message: "Error while logging in"
  })
})



 router.put("/",authMiddleWare, async (req,res) => {
   const { success } = updateBody.safeparse(req.body);

   if(!success){
      return res.status(411).json(
         {message : "Error while updating info"}
      )
   }
   await User.updateOne({_id: req.userId},req.body);
   res.json({
      message: "Updated successfully"
   })
 });

 router.get("/bulk",async(req,res)=>{
   const filter = req.query.filter;
   const users = await User.find({
      $or :[{
         firstName :{"$regex" :filter}
      },{
         lastName :{"$regex" :filter}
      }]
   })
 res.json({
   user:users.map(user => ({
      username:user.username,
      firstName:user.firstname,
      lastName:user.lastname,
      _id:user._id
   }))
 })
})



export default router;