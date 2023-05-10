const router=require("express").Router()
const User=require("../model/user")
const mongoose=require("mongoose")

const bcrypt = require('bcrypt');

router.post("/user-signup",async(req,res)=>{
      const user=await User.findOne({email:req.body.email})

      if(!user){
        try{
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            const newUser=await new User({...req.body,password:hash}).save()
            res.status(200).json({
                success:true,
                message:"ACCOUNT SUCCESSFULLY CREATED"
             })
        }catch(err){
            res.status(400).json({
                success:false,
                message:err
             })
        }

      }else{
         res.status(200).json({
            success:false,
            message:"Already existing User"
         })
      }
    
})



router.post("/user-login",async(req,res)=>{
   
    try{
        const user=await User.findOne({email:req.body.email})
        console.log(user)
      if(user){
         console.log(user.password)
        if(bcrypt.compareSync(req.body.password,user.password)){
          req.session.userId = user._id
            res.status(200).json({
                success:true,
                message:user,
                token:req.session.userId
             })

        }else{
            res.status(200).json({
                success:false,
                message:"Password not correct"
             })
        }

      }
      else{
        res.status(200).json({
            success:false,
            message:"No such user"
         })
      }
    }catch(err){
        res.status(400).json({
            success:false,
            message:err
         })
      }
    }
      
)

router.put("/user-update/:id",async(req,res)=>{
     

      try{
         const updateUser=User.find({_id:req.params.id})
        if(updateUser){
          try{
            await User.updateOne({_id:req.params.id},{$set:req.body});
            res.status(200).json({
                sucess:true,
                message:"sucessfully updated"
             })
          }
          catch(err){
            res.status(200).json({
              sucess:false,
              message:"Already Exist"
           })
          }
        }
        else{
            res.status(400).json({
                sucess:false,
                message:"No such user"
             }) 
        }
      }catch(err){
        res.status(400).json({
            sucess:false,
            message:err
         })
      }


})


router.delete("/user-delete/:id",async(req,res)=>{
     

    try{
       const updateUser=User.find({_id:req.params.id})
      if(updateUser){
          await User.deleteOne({_id:req.params.id},{$set:req.body});
          res.status(200).json({
              sucess:true,
              message:"sucessfully deleted"
           })
  
      }
      else{
          res.status(400).json({
              sucess:false,
              message:"No such user"
           }) 
      }
    }catch(err){
      res.status(400).json({
          sucess:false,
          message:err
       })
    }


})


router.get("/getuser",async(req,res)=>{
     try{
        const allUser=await User.find()
        res.status(200).json({
            sucess:true,
            message:allUser
         }) 

     }catch(err){
        res.status(400).json({
            sucess:false,
            message:err
         })
     }
})

router.get('/get-oneuser/:id', async (req, res) => {
    const id = req.params.id;
    let query;
  
    if (mongoose.Types.ObjectId.isValid(id)) {
      
      query = { _id: id };
    } else {
      
      query = { username: id };
    }
  
    try {
      const oneUser = await User.findOne(query);
   
      if(oneUser!=null){
        res.status(200).json({
          success:true,
          message: oneUser
        });
      }else{
        res.status(200).json({
          success:false,
          message:"No such User"
        });
      }
    } catch (err) {
      res.status(400).json({
        success: false,
        message:err
      });
    }
  });
  
  
  
  
  
  
  


module.exports=router