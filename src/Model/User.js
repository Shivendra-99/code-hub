import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    userId: String,
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin','problem-setter'],
        default: 'user'
    },
    post: {
        type: Array
    },
    image: String,
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
