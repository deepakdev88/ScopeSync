import projectRoutes from './routes/projectRoutes.js'
import express from 'express'; // import express framework
import cors from 'cors'; // For frontend backend security barrier
import dotenv from 'dotenv'; // for enviroment variables
import mongoose from 'mongoose';


dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;





app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Mongodb Connected")
})
.catch(() => {
    console.error("Failed")
})
app.use('/api',projectRoutes)
    
app.get('/',(req,res)=>{
    res.send("Backend running successfully.")
})




app.listen(PORT, ()=>{
    console.log(`server is listening on port ${PORT}` )
})