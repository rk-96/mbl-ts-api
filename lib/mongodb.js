import { MongoClient } from 'mongodb';

// const MONGODB_URI = "mongodb+srv://mb005:mb005@one.kdheq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const MONGODB_URI = "mongodb+srv://mb005:mb005@mybuylistcluster.0hftg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const MONGODB_DB = "ONE";
const MONGODB_DB = "db";

// mb005

let cachedClient = null;
let cachedDb = null;
export async function connectToDatabase() {
    // check the cached.
    if (cachedClient && cachedDb) {
        // load from cache
        return {
            client: cachedClient,
            db: cachedDb,
        };
    }
    // Connect to cluster
    let client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    let db = client.db(MONGODB_DB);
    // set cache
    cachedClient = client;
    cachedDb = db;
    return {
        client: cachedClient,
        db: cachedDb,
    };
}