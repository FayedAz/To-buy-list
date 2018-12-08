import { MongoClient, Db } from "mongodb";
import { generatedTeams, generatedMatches } from "./models/Generator";
import { Team } from "./models/Team";
import { Match } from "./models/Match";

async function addTeams(db : Db) {
    var bulk = db.collection<Team>('teams').initializeUnorderedBulkOp();
    for (const team of generatedTeams) {
        bulk.insert({name : team.name});
    }
    await bulk.execute();
}

async function addMatches(db : Db) {
    var bulk = db.collection<Match>('matches').initializeUnorderedBulkOp();
    for (const match of generatedMatches) {
        const team1 = await db.collection<Team>('teams').findOne({name : match.teams[0].name});
        const team2 = await db.collection<Team>('teams').findOne({name : match.teams[1].name});
        if (team1 == null || team2 == null) throw new Error();
        bulk.insert({
            date: match.date,
            scores : match.scores,
            teams : [team1._id, team2._id]
        });
    }
    await bulk.execute();
}

async function fillDB() {
    console.log('[Open]');
    const mongoClient = await MongoClient.connect('mongodb://localhost', { useNewUrlParser: true } );
    const db = mongoClient.db('soccer');
    console.log('[Drop database]');
    await db.dropDatabase();
    console.log('[Add teams]');
    await addTeams(db);
    console.log('[Add matches]');
    await addMatches(db);
    console.log('[Close]');
    await mongoClient.close();
}

fillDB();