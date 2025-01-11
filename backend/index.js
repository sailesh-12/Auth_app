require('dotenv').config();
const path = require('path');

const cookieParser = require('cookie-parser');

// Middlewares
const cors = require('cors');

//controllers

// Import routes


const authRoutes = require('./authRoute/routes');
//const userRoutes = require('./routes/user');



const express = require('express');
const connectDb = require('./DB/connectDb');
const PORT=process.env.PORT || 3000

const app = express();
app.use(cors({origin: 'http://localhost:5173', credentials: true}));

app.use(express.json());
app.use(cookieParser());

// Use routes

app.use('/api/auth', authRoutes);
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    const express = require('express');

    // Serve static files from the 'frontend/build' directory
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // Handle SPA routing, serve index.html for any unknown routes
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname,'../frontend/dist/index.html'));
    });
}

const startServer = async () => {
    try {
        await connectDb();
        app.listen(PORT, () => {
            console.log('Server is running on port 3000');
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
};


startServer();
