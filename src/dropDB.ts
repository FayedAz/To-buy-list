import { MongoClient } from "mongodb";

async function dropDB() {
    console.log('[Open]');
    const mongoClient = await MongoClient.connect('mongodb://localhost', { useNewUrlParser: true } );
    const db = mongoClient.db('soccer');
    console.log('[Drop database]');
    await db.dropDatabase();
    console.log('[Close]');
    await mongoClient.close();
}

dropDB();