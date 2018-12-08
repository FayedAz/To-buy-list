import { expect } from "chai";
import "mocha";

import { AdminModel } from "../../../src/models/admin/AdminModel"
import { AdminModelImpl } from "../../../src/models/admin/AdminModelImpl"
import { AsyncModel } from "../../../src/models/AsyncModel"
import { AsyncModelImpl } from "../../../src/models/AsyncModelImpl"
import { MongoClient, Db, ObjectId } from "mongodb";
import { ValidationError } from "class-validator";

describe('AdminModelImpl', () => {
  let model: AsyncModel;
  let adminModel: AdminModel;
  let mongoClient: MongoClient;
  let db: Db;

  function extractMessages(errors: ValidationError[]): string[] {
    const messages = [];
    for (const error of errors)
      for (const key in error.constraints)
        messages.push(error.constraints[key]);
    return messages;
  }

  before(async () => {
    mongoClient = await MongoClient.connect('mongodb://localhost', { useNewUrlParser: true });
    db = mongoClient.db('test');
    model = new AsyncModelImpl(db);
    adminModel = new AdminModelImpl(db, model);
  });

  describe('#addTeam', async () => {
    it('should add team', async () => {
      const result: ObjectId = await adminModel.addTeam({ name: 'toto' });
      const team = await db.collection('teams').findOne({ _id: result });
      expect(team).be.deep.equal({ _id: result, name: 'toto' });
    });
    it('should throw an exception if the object is empty', async () => {
      try {
        await adminModel.addTeam({});
      } catch (exception) {
        return;
      }
      expect.fail();
    });
    it('should throw \'Team\'s name is too short\'', async () => {
      try {
        await adminModel.addTeam({ name: 't' });
      } catch (exception) {
        expect(extractMessages(exception)).includes.deep.members(['Team\'s name is too short']);
        return;
      }
      expect.fail();
    });
    it('should throw \'Team\'s name is too long\'', async () => {
      try {
        await adminModel.addTeam({ name: '012345678901234567890123456789' });
      } catch (exception) {
        expect(extractMessages(exception)).includes.deep.members(['Team\'s name is too long']);
        return;
      }
      expect.fail();
    });
    it('should throw an exception if the object is empty', async () => {
      try {
        await adminModel.addTeam({});
      } catch (exception) {
        return;
      }
      expect.fail();
    });
  });

  describe('#addMatch', async () => {
    it('should add match', async () => {
      const team0Id: ObjectId = await adminModel.addTeam({ name: 'aaa' });
      const team1Id: ObjectId = await adminModel.addTeam({ name: 'bbb' });
      const matchId: ObjectId = await adminModel.addMatch({
        date: '1995-12-17',
        team0: team0Id.toString(),
        team1: team1Id.toString(),
        score0: '1',
        score1: '2'
      });
      const match = await db.collection('matches').findOne({ _id: matchId });
      expect(match).be.deep.equal(
        {
          _id: matchId,
          date: new Date('1995-12-17T00:00:00.000Z'),
          teams: [team0Id, team1Id], scores: [1, 2]
        });
    });
    it('should throw an exception if the object is empty', async () => {
      try {
        await adminModel.addMatch({});
      } catch (exception) {
        return;
      }
      expect.fail();
    });
    it('should throw an exception if teams are not different', async () => {
      try {
        const teamId: ObjectId = await adminModel.addTeam({ name: 'aaa' });
        await adminModel.addMatch({
          date: '1995-12-17',
          team0: teamId.toString(),
          team1: teamId.toString(),
          score0: '1',
          score1: '2'
        });
      } catch (exception) {
        expect(exception.message).be.equal('Teams must be different');
        return;
      }
      expect.fail();
    });
    it('should throw an exception if score 0 is lower than 0', async () => {
      try {
        const team0Id: ObjectId = await adminModel.addTeam({ name: 'aaa' });
        const team1Id: ObjectId = await adminModel.addTeam({ name: 'bbb' });
        await adminModel.addMatch({
          date: '1995-12-17',
          team0: team0Id.toString(),
          team1: team1Id.toString(),
          score0: '-1',
          score1: '2'
        });
        } catch (exception) {
        expect(exception.message).be.equal('Scores must be positive');
        return;
      }
      expect.fail();
    });
    it('should throw an exception if score 1 is lower than 0', async () => {
      try {
        const team0Id: ObjectId = await adminModel.addTeam({ name: 'aaa' });
        const team1Id: ObjectId = await adminModel.addTeam({ name: 'bbb' });
        await adminModel.addMatch({
          date: '1995-12-17',
          team0: team0Id.toString(),
          team1: team1Id.toString(),
          score0: '1',
          score1: '-2'
        });
        } catch (exception) {
        expect(exception.message).be.equal('Scores must be positive');
        return;
      }
      expect.fail();
    });
    it('should throw an exception if score 0 is greater than 100', async () => {
      try {
        const team0Id: ObjectId = await adminModel.addTeam({ name: 'aaa' });
        const team1Id: ObjectId = await adminModel.addTeam({ name: 'bbb' });
        await adminModel.addMatch({
          date: '1995-12-17',
          team0: team0Id.toString(),
          team1: team1Id.toString(),
          score0: '101',
          score1: '0'
        });
        } catch (exception) {
        expect(exception.message).be.equal('Scores must be less than or equal to 100');
        return;
      }
      expect.fail();
    });
    it('should throw an exception if score 1 is greater than 100', async () => {
      try {
        const team0Id: ObjectId = await adminModel.addTeam({ name: 'aaa' });
        const team1Id: ObjectId = await adminModel.addTeam({ name: 'bbb' });
        await adminModel.addMatch({
          date: '1995-12-17',
          team0: team0Id.toString(),
          team1: team1Id.toString(),
          score0: '0',
          score1: '101'
        });
        } catch (exception) {
        expect(exception.message).be.equal('Scores must be less than or equal to 100');
        return;
      }
      expect.fail();
    });
  });

  after(async () => {
    await db.dropDatabase();
    await mongoClient.close();
  });

});