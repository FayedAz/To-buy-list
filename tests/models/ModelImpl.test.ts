import { expect } from "chai";
import "mocha";

import { ModelImpl } from "../../src/models/ModelImpl" 
import { Team } from "../../src/models/Team";
import { Match } from "../../src/models/Match";

class SimpleId {
    private _id : number;

    constructor (id : number) {
        this._id = id;
    }

    equals(id : SimpleId) : boolean {
        return this._id == id._id;
    }
}

const teams : Team[] = [{ _id : new SimpleId(1), name : 'Marseille'}, { _id : new SimpleId(3), name : 'Paris'}];
const matches : Match[] = [
    {
        _id: new SimpleId(1),
        date: new Date('1995-12-17T03:24:00'),
        teams: [{ _id : new SimpleId(1), name : 'Marseille'}, { _id : new SimpleId(3), name : 'Paris'}],
        scores: [4, 2]
    },
    {
        _id: new SimpleId(2),
        date: new Date('1995-12-17T03:24:00'),
        teams: [{ _id : new SimpleId(3), name : 'Paris'}, { _id : new SimpleId(1), name : 'Marseille'}],
        scores: [4, 2]
    },
    {
        _id: new SimpleId(3),
        date: new Date('1995-12-17T03:24:00'),
        teams: [{ _id : new SimpleId(3), name : 'Paris'}, { _id : new SimpleId(2), name : 'Lyon'}],
        scores: [2, 2]
    }
];

describe('SoccerModelImpl', () => {

    describe('#teams', () => {
        it('should return teams', () => {
            const model = new ModelImpl(teams, matches);
            expect(model.teams()).includes.deep.members(teams);
        });
    });

    describe('#matches', () => {
        it('should return matches', () => {
            const model = new ModelImpl(teams, matches);
            expect(model.matches()).includes.deep.members(matches);
        });
    });

    describe('#team', () => {
        it('should return the team', () => {
            const model = new ModelImpl(teams, matches);
            expect(model.team(new SimpleId(3))).be.deep.equals({ _id : new SimpleId(3), name : 'Paris'});
        });
        it('should throw exception \'Team not found\'', () => {
            const model = new ModelImpl(teams, matches);
            expect(()=>model.team(new SimpleId(2))).throw('Team not found');
        });
    });

    describe('#matchesForTeam', () => {
        it('should return matches played by the team', () => {
            const model = new ModelImpl(teams, matches);
            expect(model.matchesForTeam({ _id : new SimpleId(1), name : 'toto'})).includes.deep.members([
                {
                    _id: new SimpleId(1),
                    date: new Date('1995-12-17T03:24:00'),
                    teams: [{ _id : new SimpleId(1), name : 'Marseille'}, { _id : new SimpleId(3), name : 'Paris'}],
                    scores: [4, 2]
                },
                {
                    _id: new SimpleId(2),
                    date: new Date('1995-12-17T03:24:00'),
                    teams: [{ _id : new SimpleId(3), name : 'Paris'}, { _id : new SimpleId(1), name : 'Marseille'}],
                    scores: [4, 2]
                }
            ]);
        });
        it('should return no matches', () => {
            const model = new ModelImpl(teams, matches);
            expect(model.matchesForTeam({ _id : new SimpleId(123), name : 'toto'})).to.be.an('array').that.is.empty;
        });
    });
});