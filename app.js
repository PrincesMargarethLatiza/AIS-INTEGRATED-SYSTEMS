import express from "express";
import 'dotenv/config.js';
import cors from "cors";
import UserRoutes from "./routes/UserRoutes.js";

//create express app
const app = express();

//ENABLE CORS TO FRONTEND
let corsOptions = {
    origin: process.env.ORIGIN
}

//middleware
app.use(express.json());
app.use(cors(corsOptions));


app.use((req, res, next) =>{
    console.log(req.path, req.method);
    next();
})

const port = 3000;

try{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`Listening to port ${process.env.PORT || 3000}...`);
    });
}catch(e){
    console.log(e);
}


app.use('/user', UserRoutes);




