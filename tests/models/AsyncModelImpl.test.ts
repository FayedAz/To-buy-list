import { expect, assert } from "chai";
import "mocha";

import { AsyncModelImpl } from "../../src/models/AsyncModelImpl" 

import { MongoClient, Db, ObjectID } from "mongodb";
import { Team } from "../../src/models/Team";

describe('AsyncModelImpl', () => {
    let model : AsyncModelImpl;
    let mongoClient : MongoClient;
    let db : Db;

    let marseilleId : ObjectID;
    let parisId : ObjectID;
    let lyonId : ObjectID;
    let matchId : ObjectID;

    before(async () => {
        mongoClient = await MongoClient.connect('mongodb://localhost', { useNewUrlParser: true } );
        db = mongoClient.db('test');
        model = new AsyncModelImpl(db);

        const marseilleResult = await db.collection<Team>('teams').insertOne({ name : 'Marseille' });
        marseilleId = marseilleResult.insertedId;
        const parisResult = await db.collection<Team>('teams').insertOne({ name : 'Paris' });
        parisId = parisResult.insertedId;
        const lyonResult = await db.collection<Team>('teams').insertOne({ name : 'Lyon' });
        lyonId = lyonResult.insertedId;

        const matchResult = await db.collection<Team>('matches').insertOne({ 
            date: new Date('1995-12-17T03:24:00'),
            teams: [marseilleId, parisId],
            scores: [4, 2]
        });
        matchId = matchResult.insertedId;
    });

    describe('#teams', () => {
        it('should return teams', async () => {
            expect(await model.teams()).includes.deep.members([
                { _id : marseilleId , name : 'Marseille'},
                { _id : parisId, name : 'Paris' },
                { _id : lyonId, name : 'Lyon' }
            ]);
        });
    });

    describe('#matches', () => {
        it('should return matches', async () => {
            expect(await model.matches()).includes.deep.members([
                { 
                    _id: matchId,
                    date: new Date('1995-12-17T03:24:00'),
                    teams: [{ _id : marseilleId , name : 'Marseille'}, { _id : parisId, name : 'Paris' }],
                    scores: [4, 2]
                }
            ]);
        });
    });

    describe('#team', () => {
        it('should return team', async () => {
            expect(await model.team(marseilleId)).to.deep.equal({ _id : marseilleId , name : 'Marseille'});
        });
        it('should throw exception \'Team not found\'', async () => {
            try {
                await model.team(123);
            } catch (exception) {
                expect(exception.message).to.be.equal('Team not found');
                return;
            }
            expect.fail();
        });
    });

    describe('#matchesForTeam', () => {
        it('should return one match', async () => {
            expect(await model.matchesForTeam({_id : marseilleId, name : 'toto'})).includes.deep.members([
                { 
                    _id: matchId,
                    date: new Date('1995-12-17T03:24:00'),
                    teams: [{ _id : marseilleId , name : 'Marseille'}, { _id : parisId, name : 'Paris' }],
                    scores: [4, 2]
                }
            ]);
        });
        it('should return no matches', async () => {
            expect(await model.matchesForTeam({_id : lyonId, name : 'toto'})).includes.deep.members([]);
        });
    });
    
    after(async () => {
        await db.dropDatabase();
        await mongoClient.close();
    });

});