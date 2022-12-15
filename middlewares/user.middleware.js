const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
    try {
        const token = req.headers["access_token"];
        const check = jwt.verify(token,process.env.SECRET_KEY);
        if(check){
            req.body.id = check.id
            next();
        }
        else{
            return res.status(401).json({
                message:"invalid token"
            })
        }
        
    } catch (error) {
        return res.status(401).json({
            message:"invalid token"
        })
    }
}