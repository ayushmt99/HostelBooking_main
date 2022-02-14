const jwt = require("jsonwebtoken");

module.exports = async (req,res,next) => {
    try{
        if(!req.headers.authorization){
            return res.status(401).send({
                message: "Unauthorized"
            });
        }
        let token = req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(401).send({
                message: "Unauthorized"
            });
        }
        let user = await jwt.verify(token,"123");
        console.log(user);
        req.userdata = user;
        next()
    }
    catch(err){
        res.status(500).send({
            message: "Somethng went wrong"
        });
    }

}