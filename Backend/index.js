import Express from "express";
import { connecToMongo } from "./db.js";
import userRouter from "./Routes/UserCreate.js"
import FoodRouter from "./Routes/DisplayData.js"
import MycartRouter from "./Routes/UserOrder.js"
import cors from "cors";
import dotenv from "dotenv"

dotenv.config();

const app = Express();

// console.log( process.env.MONGODB_URI)
//Connecting app to the DataBase
connecToMongo();

const corsOptions = {
  origin: 
    process.env.NODE_ENV === 'production'?
    [
      process.env.PRODUCTION_URL_DOMAIN,
      process.env.PRODUCTION_URL_DEPLOYMENT
    ] :
    ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};


app.use(cors(corsOptions));

app.use(Express.json());
//Adding Usercreate 
app.use("/api/user", userRouter);
//Adding user foodorder
app.use("/api/auth", MycartRouter);
//Adding footitem
app.use("/api", FoodRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})


export default app;