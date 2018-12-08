import { expect } from "chai";
import "mocha";

import { Match } from "../../src/models/Match" 
import { TeamStatisticsImpl } from "../../src/models/TeamStatisticsImpl";

class SimpleId {
    private _id : number;

    constructor (id : number) {
        this._id = id;
    }

    equals(id : SimpleId) : boolean {
        return this._id == id._id;
    }
}


describe('TeamStatistics', () => {

    const marseille = { _id : new SimpleId(1), name : 'Marseille'};
    const paris = { _id : new SimpleId(3), name : 'Paris'};

    describe('#constructor', () => {
        it('should return an empty team statistics', () => {
            const statistics = new TeamStatisticsImpl(marseille, []);
            expect(statistics).to.deep.equal({
                team : { _id : new SimpleId(1), name : 'Marseille'},
                playedMatchCount: 0,
                wonMatchCount: 0,
                drawMatchCount: 0,
                lostMatchCount: 0,
                goalForCount: 0,
                goalAgainstCount: 0,
                goalDifference: 0,
                pointCount: 0
            });
        });
    });

    describe('#addWonMatch', () => {
        const statistics = new TeamStatisticsImpl(marseille, []);
        statistics.addWonMatch();
        statistics.addWonMatch();
        it('should increment playedMatchCount', () => {
            expect(statistics.playedMatchCount).to.be.equal(2)
        });
        it('should increment wonMatchCount', () => {
            expect(statistics.wonMatchCount).to.be.equal(2)
        });
        it('should not increment lostMatchCount', () => {
            expect(statistics.lostMatchCount).to.be.equal(0)
        });
        it('should not increment drawMatchCount', () => {
            expect(statistics.drawMatchCount).to.be.equal(0)
        });
        it('should increment pointCount', () => {
            expect(statistics.pointCount).to.be.equal(6)
        });
    });

    describe('#addLostMatch', () => {
        const statistics = new TeamStatisticsImpl(marseille, []);
        statistics.addLostMatch();
        statistics.addLostMatch();
        it('should increment playedMatchCount', () => {
            expect(statistics.playedMatchCount).to.be.equal(2)
        });
        it('should not increment wonMatchCount', () => {
            expect(statistics.wonMatchCount).to.be.equal(0)
        });
        it('should increment lostMatchCount', () => {
            expect(statistics.lostMatchCount).to.be.equal(2)
        });
        it('should not increment drawMatchCount', () => {
            expect(statistics.drawMatchCount).to.be.equal(0)
        });
        it('should not increment pointCount', () => {
            expect(statistics.pointCount).to.be.equal(0)
        });
    });

    describe('#addDrawMatch', () => {
        const statistics = new TeamStatisticsImpl(marseille, []);
        statistics.addDrawMatch();
        statistics.addDrawMatch();
        it('should increment playedMatchCount', () => {
            expect(statistics.playedMatchCount).to.be.equal(2)
        });
        it('should not increment wonMatchCount', () => {
            expect(statistics.wonMatchCount).to.be.equal(0)
        });
        it('should not increment lostMatchCount', () => {
            expect(statistics.lostMatchCount).to.be.equal(0)
        });
        it('should increment drawMatchCount', () => {
            expect(statistics.drawMatchCount).to.be.equal(2)
        });
        it('should increment pointCount', () => {
            expect(statistics.pointCount).to.be.equal(2)
        });
    });

    describe('#addGoalsFor', () => {
        const statistics = new TeamStatisticsImpl(marseille, []);
        statistics.addGoalsFor(2);
        statistics.addGoalsFor(4);
        it('should increment goalForCount', () => {
            expect(statistics.goalForCount).to.be.equal(6)
        });
        it('should not increment goalAgainstCount', () => {
            expect(statistics.goalAgainstCount).to.be.equal(0)
        });
        it('should increment goalDifference', () => {
            expect(statistics.goalDifference).to.be.equal(6)
        });
    });

    describe('#addGoalsAgainst', () => {
        const statistics = new TeamStatisticsImpl(marseille, []);
        statistics.addGoalsAgainst(2);
        statistics.addGoalsAgainst(4);
        it('should not increment goalForCount', () => {
            expect(statistics.goalForCount).to.be.equal(0)
        });
        it('should increment goalAgainstCount', () => {
            expect(statistics.goalAgainstCount).to.be.equal(6)
        });
        it('should decrement goalDifference', () => {
            expect(statistics.goalDifference).to.be.equal(-6)
        });
    });

    describe('#addMatch', () => {
        it('should compute stats [first team wins]', () => {
            const marseilleStatistics = new TeamStatisticsImpl(marseille, []);
            const parisStatistics = new TeamStatisticsImpl(paris, []);
            const match : Match = {
                _id: new SimpleId(1),
                date: new Date(),
                teams: [marseille, paris],
                scores: [4, 2]
            }
            marseilleStatistics.addMatch(match);
            parisStatistics.addMatch(match);
            expect(marseilleStatistics).be.deep.equal({
                team : marseille,
                playedMatchCount: 1,
                wonMatchCount: 1,
                drawMatchCount: 0,
                lostMatchCount: 0,
                goalForCount: 4,
                goalAgainstCount: 2,
                goalDifference: 2,
                pointCount: 3
            });
            expect(parisStatistics).be.deep.equal({
                team : paris,
                playedMatchCount: 1,
                wonMatchCount: 0,
                drawMatchCount: 0,
                lostMatchCount: 1,
                goalForCount: 2,
                goalAgainstCount: 4,
                goalDifference: -2,
                pointCount: 0
            });
        });
        it('should compute stats [second team wins]', () => {
            const marseilleStatistics = new TeamStatisticsImpl(marseille, []);
            const parisStatistics = new TeamStatisticsImpl(paris, []);
            const match : Match = {
                _id: new SimpleId(1),
                date: new Date(),
                teams: [marseille, paris],
                scores: [2, 4]
            }
            marseilleStatistics.addMatch(match);
            parisStatistics.addMatch(match);
            expect(marseilleStatistics).be.deep.equal({
                team : marseille,
                playedMatchCount: 1,
                wonMatchCount: 0,
                drawMatchCount: 0,
                lostMatchCount: 1,
                goalForCount: 2,
                goalAgainstCount: 4,
                goalDifference: -2,
                pointCount: 0
            });
            expect(parisStatistics).be.deep.equal({
                team : paris,
                playedMatchCount: 1,
                wonMatchCount: 1,
                drawMatchCount: 0,
                lostMatchCount: 0,
                goalForCount: 4,
                goalAgainstCount: 2,
                goalDifference: 2,
                pointCount: 3
            });
        });
        it('should compute stats [draw match]', () => {
            const marseilleStatistics = new TeamStatisticsImpl(marseille, []);
            const parisStatistics = new TeamStatisticsImpl(paris, []);
            const match : Match = {
                _id: new SimpleId(1),
                date: new Date(),
                teams: [marseille, paris],
                scores: [2, 2]
            }
            marseilleStatistics.addMatch(match);
            parisStatistics.addMatch(match);
            expect(marseilleStatistics).be.deep.equal({
                team : marseille,
                playedMatchCount: 1,
                wonMatchCount: 0,
                drawMatchCount: 1,
                lostMatchCount: 0,
                goalForCount: 2,
                goalAgainstCount: 2,
                goalDifference: 0,
                pointCount: 1
            });
            expect(parisStatistics).be.deep.equal({
                team : paris,
                playedMatchCount: 1,
                wonMatchCount: 0,
                drawMatchCount: 1,
                lostMatchCount: 0,
                goalForCount: 2,
                goalAgainstCount: 2,
                goalDifference: 0,
                pointCount: 1
            });
        });
    });
});