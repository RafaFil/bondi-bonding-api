const { MongoClient } = require("mongodb");
const connectionString = process.env.DB_URI;
const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection = {};

module.exports = {
    connectToServer: async function () {
        return client.connect()
        .then(db => {
            if (!db) {
                return;
            }

            dbConnection = db.db(process.env.DB_NAME);
            console.log("Successfully connected to MongoDB.");
        })
        .catch(err => {
            console.log(err);
        });
    },

    getDb: function () {
        return dbConnection;
    }
};
