import express from 'express'
import { configDotenv } from 'dotenv';
import adminRouter from './router/admin-router.js';
import managerRouter from './router/manager-router.js';
import cors from 'cors'
configDotenv();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/manager", managerRouter)

app.listen(process.env.PORT,() =>{
console.log(`listening on port ${process.env.PORT}`);

})