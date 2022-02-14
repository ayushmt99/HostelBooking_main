const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("./config/auth");
const room = require("../models/room");
const user = require("../models/user");


// Post Request for booking room
// Data Required- roomno
// There should be userdata in req 
router.post('/bookroom', auth, async (req,res) =>{
    try{
        const roomno = req.body.roomno;
        const userdata = req.userdata;
        const rollno = userdata.rollno
        let data = await user.findOne({rollno});
        // console.log(data);

        //Checking if the room has already been assigned to the registered user
        if(data.roomno){
            res.status(409).send({
                message: "You have Already been assigned room",
                alloted_roomno: data.roomno
            });
        }
        else{
            data1 = await room.findOne({roomno});
            // console.log(data1);

            //Checking if the requested roomno exists in db
            if(!data1){
                res.status(404).send({
                    message: "Enter valid room no"
                });
            }
            else{
                console.log(data1.student_count);

                // Checking if the room is already full(i.e 3 students assigned)
                if(data1.student_count===3){
                    res.send({
                        message: "room already booked"
                    });
                }
                else{
                    //Updating room model
                    let roominfo
                    if(data1.student_count===0){
                        const query = {
                            student1: userdata.id,
                            student_count: data1.student_count+1
                        }
                        roominfo = await room.findOneAndUpdate({roomno},query,{
                            new: true
                        }).lean().populate('student1 student2 student3', 'name rollno');
                        console.log(roominfo);
                    }
                    else if(data1.student_count===1){
                        const query = {
                            student2: userdata.id,
                            student_count: data1.student_count+1
                        }
                        roominfo = await room.findOneAndUpdate({roomno},query,{
                            new: true
                        }).lean().populate('student1 student2 student3', 'name rollno');
                        console.log(roominfo);
                    }
                    else{
                        const query = {
                            student3: userdata.id,
                            student_count: data1.student_count+1
                        }
                        roominfo = await room.findOneAndUpdate({roomno},query,{
                            new: true
                        }).lean().populate('student1 student2 student3', 'name rollno');                        
                        console.log(roominfo);
                        
                    }

                    // Updating User Model
                    const filter = {_id: userdata.id};
                    const userupdate = {roomno};
                    const userinfo = await user.findOneAndUpdate(filter,userupdate,{
                        new: true
                    }).select("roomno name rollno");
                    res.send({
                        userinfo,
                        roominfo
                    });
                }
            }
        }
    }
    catch(err){
        console.log(err)
        res.status(500).send({
            message: "somthing went wrong"
        });
    }

});
//get request for user details
router.get('/user',auth ,async (req,res) => {
    try{
        let rollno = req.userdata.rollno;
        const userinfo = await user.findOne({rollno}).select('rollno name roomno');
        res.send({
            userinfo
        });
    }
    catch(err){
        res.status(500).send({
            message: 'Something went wrong'
        });
    }
});

module.exports = router;