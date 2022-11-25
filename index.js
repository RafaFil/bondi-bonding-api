if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { connectToServer } = require('./src/configs/db.config');
const { validateJWT } = require('./src/middlewares/validateJWT.middleware');
const authRouter = require('./src/routes/auth.routes');
const staticRouter = require('./src/routes/static.routes');
const stopsRouter = require('./src/routes/stops.routes');
const linesRouter = require('./src/routes/lines.routes');
const profilePictureRouter = require('./src/routes/profilePicture.routes');
const mapRouter = require('./src/routes/map.routes');
const userRouter = require('./src/routes/user.routes');
const tripsRouter = require('./src/routes/trips.routes');
const profileRouter = require('./src/routes/profile.routes');

const BASE_ROUTE = "/api/v1";

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// public routes
app.use(BASE_ROUTE, authRouter);
app.use(BASE_ROUTE, userRouter);
app.use(BASE_ROUTE, staticRouter);

// protected routes
app.use(validateJWT);
app.use(BASE_ROUTE, stopsRouter);
app.use(BASE_ROUTE, linesRouter);
app.use(BASE_ROUTE, profilePictureRouter);
app.use(BASE_ROUTE, mapRouter);
app.use(BASE_ROUTE, tripsRouter);
app.use(BASE_ROUTE, profileRouter);

connectToServer()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`listening on port ${process.env.PORT}`);
    });
});