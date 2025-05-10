import jwt from 'jsonwebtoken';
import User from "../Model/User.js";

export const authMiddleware =  async(req, res, next)=>{
    try{
        console.log(req.cookies);
        const token = req.cookies.authToken;
        console.log(req.cookie);
        if(!token){
            return res.json({
                message: "Unauthorized - No Token found"
            });
        }
        let decodeed;
        console.log(req.cookie);
        try{
            decodeed = jwt.verify(token, process.env.JWT_SECRET);
            if(decodeed.iss === process.env.ISSUER){
                console.log(decodeed);
                const userId = decodeed.id;
                console.log("id=>" + userId);

                //here in select method whatever you will pass it exclude from the result after finding the user

                const user = await User.findById(userId).select("-password -createdAt -verificationToken -__v");
                
                if(!user){
                    return res.json({
                        message: "Unable to find user something went wrong"
                    })
                }
                req.user = user;
                
                next();
            }else{
                return res.json({
                    message: "Token is tempared by someone please clear your cache and try login to login"
                })
            }
        }catch(error){
            console.log(error)
            return res.json({
                message: "Unauthorized - Provided token is not valid"
            })
        }

    }catch(error){
       // console.log(error);
        return res.status(500).json({
            message: "Authentication failed please try again later"
        })
    }
}