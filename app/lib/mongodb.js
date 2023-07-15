import { MongoClient, ServerApiVersion } from 'mongodb';
import config from '../config/mongodb.config.js';

const uri = `mongodb+srv://${config.USERNAME}:${config.PASSWORD}@${config.HOST}/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const db = client.db(config.DATABASE);

try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connect to Database!");
  } catch (err) {
      console.log(err);
      console.log('something wrong')
      process.exit();
}

export default db;