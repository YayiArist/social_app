const express = require ("express");
const app = express();
const mongoose = require ("mongoose");
const dotenv = require ("dotenv");
const helmet = require ("helmet");
const morgan = require ("morgan");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require ("./routes/posts")



dotenv.config();


mongoose.connect(process.env.MONGO_URL,
    (err)=>{
    if(err){
        console.log("********ERROR DE CONEXION****")
    }else{
        console.log("********CONEXION CORRECTA****")
    }
});

  //middleware
  app.use(express.json());
  app.use(helmet());
  app.use(morgan("common"));

  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);
  app.use("/api/posts", postRoute);
 
  //app.use("/api/hosp", hospRoute);

 








app.listen(3001, ()=> {console.log ("listening on port 3001")})