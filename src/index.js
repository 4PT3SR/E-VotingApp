const express = require('express');
const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, './.env')
});
const cors = require('cors');
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');



// const swaggerJsDoc = require("swagger-jsdoc");
// const swaggerDocs = require('./utils/swagger')
// const swaggerUi = require("swagger-ui-express");


const connectDb = require('./db/mongoose');
const limiter = require('./utils/rateLimit')
const notFound = require('./controllers/notFoundController');
const globalErrorHandler = require('./controllers/globalErrorHandler');
const userRouter = require('./routes/userRoute');
const electionRouter = require('./routes/electionRoute')
// const postRouter = require('./routes/postRoute');
// const commentRouter = require('./routes/commentRoute');
// const paymentRouter = require('./routes/paymentRoute');
// const adminRouter = require('./routes/adminRoute');


const app = express();
const PORT = process.env.PORT || 6900;
// cors config
app.use(cors({
    origin: 'https://bellsevoting.onrender.com'
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(limiter)
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use('/api/user', userRouter);
app.use('/api/election', electionRouter);
// app.use('/api/post',postRouter);
// app.use('/api/',commentRouter);
// app.use('/api/',paymentRouter);
// app.use('/api/',adminRouter);
// app.use('learngrazac/api/',paymentRouter);

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.all('*', notFound);

app.use(globalErrorHandler);
const startApp = async () => {
    try {
        await connectDb(process.env.MONGOURI)
        console.log('Conencted to DB')
        app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
    } catch (err) {
        console.log(err);
        process.exit(1)
    }
}

startApp();