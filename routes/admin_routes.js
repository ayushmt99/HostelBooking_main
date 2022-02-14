const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("./config/auth");
const room = require("../models/room");
const user = require("../models/user");
const { route } = require("./config/login");


//get request for room
router.get('/room', auth,async (req,res) =>{
    try{
        const info = await room.find().select("roomno student1 student2 student3").lean().populate('student1 student2 student3', 'name rollno');
        console.log(info);
        res.send({
            room_count: info.length,
            info
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            message:"somthing went wrong"
        });
    }
});


// post request for adding new room
// required data- roomno
router.post("/room",auth,async (req,res) =>{
    try{
        const roomno = req.body.roomno;
        let data = await room.findOne({roomno});
        // console.log(data);
        if(data){
            res.status(409).send({
                message: "Room already exists"
            });
        }
        else{
            const newroom = new room({
                roomno
            });
            let info = await newroom.save();
            res.send({
                message: "new room added",
                data: info
            });
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            message: 'Somthing went wrong'
        });
    }
});


// resquest for delete room
// required data - roomno
router.delete('/room/:rno', auth, async (req,res) => {
    try{
        const rno = req.params.rno;
        console.log(rno);
        const roominfo = await room.findOneAndDelete({roomno:rno});
        const userinfo = await user.update({roomno:rno},0,{
            multi: true,
            upsert: true
        });
        res.send({
            roominfo,
            userinfo
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            message: 'Something went wrong'
        })
    }
})
module.exports = router;