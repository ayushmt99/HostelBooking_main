const router = require("express").Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const user = require("../../models/user");
const bcrypt = require("bcrypt");

router.post("/",async (req,res) =>{
    try
    {
        const{
        rollno,
        password,
        }=req.body;
        // console.log(rollno);
        let data = await user.findOne({rollno});  
        console.log(data);    
        if(data){
            let exist = await bcrypt.compare(password,data.password);
            console.log(exist);
            if(exist===true){
                let token = await jwt.sign({
                    rollno: data.rollno,
                    id: data._id
                },'123');  
                res.send({
                    message: "login successful",
                    token: token
                });

            }
            else{
                res.status(401).send({
                    message: "Invalid Credentials"
                });
            }
        }
        else{
            res.status(401).send({
                message: "Invalid Credentials"
            })
        }
    }
    catch(err){
        res.status(500).send({
            message: "Something went wrong"
        });
    }
});

module.exports = router;