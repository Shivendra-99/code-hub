import jwt from 'jsonwebtoken';
import User from "../Model/User.js";

export const authMiddleware =  async(req, res, next)=>{
    try{
        const token = req.cookies.authToken;
        if(!token){
            return res.status(401).json({
                message: "Unauthorized - No Token found"
            });
        }
        let decodeed;
        try{
            decodeed = jwt.verify(token, process.env.JWT_SECRET);
            if(decodeed.iss === process.env.ISSUER){
                const userId = decodeed.id;

                //here in select method whatever you will pass it exclude from the result after finding the user

                const user = await User.findById(userId).select("-password -createdAt -verificationToken -__v");
                
                if(!user){
                    return res.status(500).json({
                        message: "Unable to find user something went wrong"
                    })
                }
                req.user = user;
                console.log("User found in authMiddleware", user);
                next();
            }else{
                return res.status(401).json({
                    message: "Token is tempared by someone please clear your cache and try login to login"
                })
            }
        }catch(error){
            console.log(error)
            return res.status(401).json({
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

export const checkAdmin = (req,res,next) => {
    try{
        let role = req.user.role;
        req.isAdmin = false;
        req.isProblemSetter = false;
        if(role === 'admin'){
            req.isAdmin = true;
            req.isProblemSetter = false;
        }else if(role === 'problem-setter'){
            req.isAdmin = false;
            req.isProblemSetter = true;
        }      
        next();
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Something Went wrong in checkAdmin middleware please check the log"
        })
    }
}