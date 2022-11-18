const { MongoClient } = require("mongodb");
const connectionString = process.env.DB_URI;
const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;

const connectionErrorHandler = (err) => {
    console.error(err);
    throw new Error(err);
}

module.exports = {

    connectToServer: async function (onError, onSuccess) {
        const connectionResult = await client.connect();

        if (connectionResult.err) {
            onError(connectionResult.err);
        }

        else {
        dbConnection = connectionResult.db(process.env.DB_NAME);
        onSuccess();
        }
    },

    getDb: async function () {
        if (!dbConnection) {
            await this.connectToServer(
                connectionErrorHandler,
                () => console.log("Successfully connected to MongoDB.")
            );
        }
        return dbConnection;
    },

};