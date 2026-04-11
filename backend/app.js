import express from 'express'
import authRoute from './routes/authRoute.routes.js'
import incomeRoute from './routes/incomeRoute.routes.js'
import expenseRoute from './routes/expense.route.js'
import dashboardRoute from './routes/dashboard.route.js'
import cors from 'cors'
import path from 'path'

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express()

app.use(cors({
    origin:process.env.CLIENT_URL ||"https://expense-tracker-app-4dpz.onrender.com"|| "*",
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/income",incomeRoute)
app.use("/api/v1/expense",expenseRoute)
app.use("/api/v1/dashboard",dashboardRoute)

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app