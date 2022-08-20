const express = require('express');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, './.env')});
const rateLimit = require('express-rate-limit')

// const swaggerJsDoc = require("swagger-jsdoc");
// const swaggerDocs = require('./utils/swagger')
// const swaggerUi = require("swagger-ui-express");


const connectDb = require('./db/mongoose');
const limiter = require('./utils/rateLimit')
const notFound = require('./controllers/notFoundController');
const globalErrorHandler = require('./controllers/globalErrorHandler');
const userRouter = require('./routes/userRoute');
const postRouter = require('./routes/postRoute');
const commentRouter = require('./routes/commentRoute');
const paymentRouter = require('./routes/paymentRoute');
const adminRouter = require('./routes/adminRoute');


const app = express();
const PORT = process.env.PORT || 6900;

app.use(express.json());
app.use(limiter)
app.use(express.urlencoded({ extended: true}));
app.use('/learngrazac/api/user',userRouter);
app.use('/learngrazac/api/post',postRouter);
app.use('/learngrazac/api/',commentRouter);
app.use('/learngrazac/api/',paymentRouter);
app.use('/learngrazac/api/',adminRouter);
// app.use('learngrazac/api/',paymentRouter);

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.all('*',notFound);

app.use(globalErrorHandler);
const startApp = async() => {
    try {
        await connectDb(process.env.MONGOURI)
        console.log('Conencted to DB')
        app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
    } catch (err) {
        console.log(err);
    }
}

startApp();