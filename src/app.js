import  express  from "express";
import morgan from "morgan";
import Authrouter from "./routes/auth.routes.js";
import FoodRouter from './routes/food.routes.js'
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express()
app.use(cors({                         
    origin : ['http://localhost:5173','https://food-app-frontend-hkcb9pcxl-bhanderiprits-projects.vercel.app','food-app-frontend-red-three.vercel.app'],
    credentials : true
}))
app.use(cookieParser())

app.use(express.json())
app.use(morgan("dev"))

app.use('/api/auth',Authrouter)
app.use('/api/food',FoodRouter)

export default app


