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
const userRouter = require('./src/routes/users');
const stopsRouter = require('./src/routes/stops.routes');
const linesRouter = require('./src/routes/lines.routes');

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

app.use(BASE_ROUTE, userRouter);
app.use(BASE_ROUTE, stopsRouter);
app.use(BASE_ROUTE, linesRouter);

connectToServer()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`listening on port ${process.env.PORT}`);
    });
});