import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://your-frontend-project.vercel.app"
    ],
    credentials: true
}));
app.use(express.json());

app.use('/api/transactions', transactionRoutes);
app.get('/', (req, res) => {
  res.send('TruEstate API is running...');
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
} else {
    connectDB();
}

export default app;