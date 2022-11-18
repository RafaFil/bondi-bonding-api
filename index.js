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

const v1 = {
    users: "users",
    auth: "auth",
    profile_pic: "pfp",
    public_profile: "public_profile",
    complete_porfile: "complete_profile",
    map: "map",
    bus_stop: "bus_stop",
    bus_line: "bus_line",
    trip: "trip",
    chatsPreview: "chats_preview",
    chat: "chat",
    liveChat: "live_chat",
    staticText: "static_text"
}

Object.entries(v1).forEach(([key, value]) => {
    v1[key] = `/api/v1/${value}`;
});

app.use(v1.users, usersRouter);

// starting the server
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});