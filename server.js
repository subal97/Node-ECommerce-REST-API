const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const dotenv = require('dotenv').config();
const DbConnect = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandling');

const authRouter = require('./routes/authRouter');
const productRouter = require('./routes/productRouter');
const blogRouter = require('./routes/blogRouter');
const prodCategoryRouter = require('./routes/prodCategoryRouter');
const blogCategoryRouter = require('./routes/blogCategoryRouter');

const PORT = process.env.PORT || 3000;

//Init DB Connection
DbConnect();

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/prodcategory', prodCategoryRouter);
app.use('/api/blogcategory', blogCategoryRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server listening at port : ${PORT}`);
});