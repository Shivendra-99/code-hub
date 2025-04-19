import mongoose, { trusted } from "mongoose";


const userSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin','problem-setter'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpired: {
        type: Date
    },
    problemSolved: {
        type: Array,
        default: []
    },
    problemAttempted: {
        type: Array,
        default: []
    } 
},{
    timestamps: true
});

const User  = mongoose.model("User", userSchema);

export default User;
