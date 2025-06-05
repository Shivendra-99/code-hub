export const getAllProblem = (req, res) =>{

    res.status(200).json({
        message: "You are able to get the number problem"
    })
}

export const createProblem = async (req,res) =>{
    console.log(req.isAdmin);
    res.status(200).json({
        message: "we got the response"
    })
}

export const getProblemById = async (req,res) =>{

}
export const deleteProblemById = async (req,res) =>{
    if(!req.isAdmin){
        return res.status(403).json({
            message: "You are not authorized to delete the problem"
        })
    }
    res.status(200).json({
        message: "Problem deleted successfully"
    })
}

export const updateProblemById = async (req,res) =>{
    if(!req.isAdmin && !req.isProblemSetter){
        // if user is not admin and problem setter then he is not authorized to update the problem
        return res.status(403).json({
            message: "You are not authorized to update the problem"
        })
    }
    res.status(200).json({
        message: "Problem updated successfully"
    })
}

export const getSolvedProblem = async (req,res) =>{
    
    res.status(200).json({
        message: "You are able to get the solved problem"
    })
}