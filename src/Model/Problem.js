import mongoose, { Schema } from "mongoose";
// Company -: what are the company asked about this question
// Liked -: Array will, contains unique userId 
//disLike -: Array will, contains unique userId 
const problemSchema = mongoose.Schema({
    createdByUserId: String,
    difficulties: {
        type: String,
        enum: ['easy','medium','hard'],
        default: ''
    },
    company: Array,
    liked: {
        type: Array,
        unique: true
    },
    disLiked: {
        type: Array,
        unique: true
    },
    solved: {
        type: Array,
        unique: true
    },
    attempted: {
        type: Array,
        unique: true
    },
    title: String,
    discription: String,
    constraiants: String,
    example: {
        type: Schema.Types.Mixed
    },
    testcase: {
        type: Schema.Types.Mixed
    }


},{
    timestamps: true
});

const Problem = mongoose.model("Problem",problemSchema);

export default Problem;