import mongoose from "mongoose";

//Tasks Schema
const TaskSchema = new mongoose.Schema({
    name: {type: String, required:true},
    status: {
        type: String,
        default: "pending",
        enum: ["pending","progress","completed"]
    }
})

//Phase Schema
const PhaseSchema = new mongoose.Schema({
    phaseName: {type:String,required:true},
    tasks:[TaskSchema]
})

//Main project schema 

const ProjectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    projectName: {type: String, required: true},
    models:{
        type:String,
        required: true,
        enum: ["Waterfall", "Agile", "Scrum", "Kanban"]
    },
    phases:[PhaseSchema]
},{timestamps: true})

const project = mongoose.model('Project',ProjectSchema)
export default project;