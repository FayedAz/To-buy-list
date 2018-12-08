import { expect } from "chai";
import "mocha";

import { Model } from "../../src/models/Model"
import { ModelImpl } from "../../src/models/ModelImpl"
import { RankingImpl } from "../../src/models/RankingImpl"
import { Team } from "../../src/models/Team"

class SimpleId {
    private _id: number;

    constructor(id: number) {
        this._id = id;
    }

    equals(id: SimpleId): boolean {
        return this._id == id._id;
    }
}


const modelWith2TeamsAnd0Matches: Model = new ModelImpl(
    [{ _id: new SimpleId(1), name: 'Marseille' }, { _id: new SimpleId(3), name: 'Paris' }],
    []
);

const modelWith2TeamsAnd3Matches: Model = new ModelImpl(
    [
        { _id: new SimpleId(1), name: 'Marseille' },
        { _id: new SimpleId(2), name: 'Lyon' },
        { _id: new SimpleId(3), name: 'Paris' }
    ],
    [
        {
            _id: new SimpleId(1),
            date: new Date(),
            teams: [{ _id: new SimpleId(1), name: 'Marseille' }, { _id: new SimpleId(3), name: 'Paris' }],
            scores: [4, 2]
        },
        {
            _id: new SimpleId(2),
            date: new Date(),
            teams: [{ _id: new SimpleId(3), name: 'Paris' }, { _id: new SimpleId(1), name: 'Marseille' }],
            scores: [4, 2]
        },
        {
            _id: new SimpleId(3),
            date: new Date(),
            teams: [{ _id: new SimpleId(3), name: 'Paris' }, { _id: new SimpleId(2), name: 'Lyon' }],
            scores: [2, 2]
        }
    ]
);

describe('RankingImpl', () => {

    describe('#addMatches', () => {
        it('should compute stats from all matches', () => {
            const ranking = new RankingImpl(modelWith2TeamsAnd3Matches);
            const marseille: Team = { _id: new SimpleId(1), name: 'Marseille' };
            const lyon: Team = { _id: new SimpleId(2), name: 'Lyon' };
            const paris: Team = { _id: new SimpleId(3), name: 'Paris' };
            expect(ranking.table).includes.deep.members([{
                team: marseille,
                playedMatchCount: 2,
                wonMatchCount: 1,
                drawMatchCount: 0,
                lostMatchCount: 1,
                goalForCount: 6,
                goalAgainstCount: 6,
                goalDifference: 0,
                pointCount: 3
            }, {
                team: paris,
                playedMatchCount: 3,
                wonMatchCount: 1,
                drawMatchCount: 1,
                lostMatchCount: 1,
                goalForCount: 8,
                goalAgainstCount: 8,
                goalDifference: 0,
                pointCount: 4
            }, {
                team: lyon,
                playedMatchCount: 1,
                wonMatchCount: 0,
                drawMatchCount: 1,
                lostMatchCount: 0,
                goalForCount: 2,
                goalAgainstCount: 2,
                goalDifference: 0,
                pointCount: 1
            }]);
        });
    });


    describe('#compareTeamStatistics', () => {
        const ranking = new RankingImpl(modelWith2TeamsAnd0Matches);
        const marseilleStats = {
            team: { _id: new SimpleId(1), name: 'Marseille' },
            playedMatchCount: 0,
            wonMatchCount: 0,
            drawMatchCount: 0,
            lostMatchCount: 0,
            goalForCount: 0,
            goalAgainstCount: 0,
            goalDifference: 5,
            pointCount: 3
        }
        const parisStats = {
            team: { _id: new SimpleId(2), name: 'Paris' },
            playedMatchCount: 0,
            wonMatchCount: 0,
            drawMatchCount: 0,
            lostMatchCount: 0,
            goalForCount: 0,
            goalAgainstCount: 0,
            goalDifference: 0,
            pointCount: 2
        }
        const lyonStats = {
            team: { _id: new SimpleId(3), name: 'Lyon' },
            playedMatchCount: 0,
            wonMatchCount: 0,
            drawMatchCount: 0,
            lostMatchCount: 0,
            goalForCount: 0,
            goalAgainstCount: 0,
            goalDifference: 3,
            pointCount: 3
        }
        const bordeauxStats = {
            team: { _id: new SimpleId(4), name: 'Bordeaux' },
            playedMatchCount: 0,
            wonMatchCount: 0,
            drawMatchCount: 0,
            lostMatchCount: 0,
            goalForCount: 0,
            goalAgainstCount: 0,
            goalDifference: 3,
            pointCount: 3
        }
        it('should return negative value if stats1.pointCount < stats0.pointCount', () => {
            expect(ranking.compareTeamStatistics(marseilleStats, parisStats)).be.lt(0);
        });
        it('should return positive value if stats1.pointCount < stats0.pointCount', () => {
            expect(ranking.compareTeamStatistics(parisStats, marseilleStats)).be.gt(0);
        });
        it('should return negative value if points are equal and stats1.goalDifference < stats0.goalDifference', () => {
            expect(ranking.compareTeamStatistics(marseilleStats, lyonStats)).be.lt(0);
        });
        it('should return positive value if points are equal and stats1.goalDifference < stats0.goalDifference', () => {
            expect(ranking.compareTeamStatistics(lyonStats, marseilleStats)).be.gt(0);
        });
        it('should return zero if points and goal differences are equal', () => {
            expect(ranking.compareTeamStatistics(marseilleStats, marseilleStats)).be.equal(0);
        });
    });

    describe('#constructor', () => {
        it('should compute and sort stats', () => {
            const ranking = new RankingImpl(modelWith2TeamsAnd3Matches);
            const marseille: Team = { _id: new SimpleId(1), name: 'Marseille' };
            const lyon: Team = { _id: new SimpleId(2), name: 'Lyon' };
            const paris: Team = { _id: new SimpleId(3), name: 'Paris' };
            expect(ranking.table).be.deep.equal([{
                team: paris,
                playedMatchCount: 3,
                wonMatchCount: 1,
                drawMatchCount: 1,
                lostMatchCount: 1,
                goalForCount: 8,
                goalAgainstCount: 8,
                goalDifference: 0,
                pointCount: 4
            }, {
                team: marseille,
                playedMatchCount: 2,
                wonMatchCount: 1,
                drawMatchCount: 0,
                lostMatchCount: 1,
                goalForCount: 6,
                goalAgainstCount: 6,
                goalDifference: 0,
                pointCount: 3
            }, {
                team: lyon,
                playedMatchCount: 1,
                wonMatchCount: 0,
                drawMatchCount: 1,
                lostMatchCount: 0,
                goalForCount: 2,
                goalAgainstCount: 2,
                goalDifference: 0,
                pointCount: 1
            }]);
        });
    });
});