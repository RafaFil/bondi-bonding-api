if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

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

const usersRouter = require('./src/routes/users');
const baseRoute = "/api/v1";


app.use(baseRoute, usersRouter);

// starting the server
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});