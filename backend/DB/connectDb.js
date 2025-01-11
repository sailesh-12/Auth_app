const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const dbUri = process.env.MONGO_URI;
        console.log('Loaded MongoDB URI:', dbUri); // Debug log
        if (!dbUri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDb;
