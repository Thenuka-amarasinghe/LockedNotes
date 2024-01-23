const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

client.connect()
    .then(() => {
        console.log('MongoDB connected successfully!');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

module.exports = client; 