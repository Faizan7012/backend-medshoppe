const jwt = require("jsonwebtoken");

const orderTokenCheck = (req,res,next)=>{
    try {
        const token = req.headers["access_token"];
        const check = jwt.verify(token,'qwerty');
        if(check){
            if(check.userType == 'admin'){
                req.body.userID = check.id
                next();
            }
            else{
                return res.status(401).send({
                    message:"invalid token"
                })
            }
        }
        else{
            return res.status(401).send({
                message:"invalid token"
            })
        }
        
    } catch (error) {
        return res.status(401).send({
            message:"invalid token"
        })
    }
}

module.exports = {orderTokenCheck}