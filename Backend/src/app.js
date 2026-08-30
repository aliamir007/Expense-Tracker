import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'
import transactionRoutes from './routes/transaction.routes.js'
import budgetRoutes from './routes/budget.routes.js'
import errorMiddleware from './middleware/error.middleware.js'
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>{
    res.json({
        success:true,
        message:'Expense Tracker Api is running'
    });
});
app.use('/api/auth',authRoutes)
app.use('/api/transactions',transactionRoutes)
app.use('/api/budget',budgetRoutes)

app.use(errorMiddleware)

export default app;
