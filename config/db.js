const mongoose = require('mongoose');

const DbConnect = () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = mongoose.connect(process.env.DATABASE_URL);
        console.log('Database connected');
    } catch (error) {
        console.log('Database connection error');
    }
};

module.exports = DbConnect;