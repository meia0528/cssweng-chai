const express = require('express');
const dotenv  = require('dotenv');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const productRouter = require('./routes/product-router.js');
const authRouter = require('./routes/auth-router.js');
const memberRouter = require('./routes/member-router.js');
const salesRouter = require('./routes/sales-router.js');
const connectDB = require('./db-connect/db.js');

const app = express();

// Load config
dotenv.config({ path: './.env' });
const PORT = process.env.PORT || 5000;

// Enable logging in development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for React app
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// anything inside the uploads folder can be accessed through a public URL; useful for frontend task
app.use("/uploads", express.static("uploads"));

// Routes
app.use('/product-mgmt', productRouter);
app.use('/auth', authRouter);
app.use('/members', memberRouter);
app.use('/sales', salesRouter);

// Start server
const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();
