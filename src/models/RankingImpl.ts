import { TeamStatisticsImpl } from './TeamStatisticsImpl';
import { TeamStatistics } from './TeamStatistics';
import { Model } from './Model';
import { Ranking } from './Ranking';

export class RankingImpl implements Ranking {
    /**
     * @see Ranking#table
     */
    table : TeamStatistics[];

    /**
     * Construit un classement en utilisant les donnÃ©es du modÃ¨les.
     * 
     * @param model ModÃ¨le contenant les donnÃ©es 
     *                    pour rÃ©aliser le classement.
     */
    constructor(model: Model) {
        this.table = [];
        this.fillTable(model);
        this.table.sort(this.compareTeamStatistics);
    }

    /**
     * Remplit le tableau table avec les statistiques.
     * 
     * @param model ModÃ¨le contenant les donnÃ©es.
     */
    fillTable(model : Model) : void {
        for(const team of model.teams()){
            const matches = model.matchesForTeam(team);
            const stats = new TeamStatisticsImpl(team, matches);
            this.table.push(stats);
        }
    }

    /**
     * Compare deux statistiques. 
     * 
     * Si stats1.pointCount != stats0.pointCount, est retournÃ© :
     * - un nombre nÃ©gatif si stats1.pointCount < stats0.pointCount
     * - un nombre positif si stats1.pointCount > stats0.pointCount
     * Si stats1.pointCount == stats0.pointCount, est retournÃ© :
     * - un nombre nÃ©gatif si stats1.goalDifference < stats0.goalDifference
     * - un nombre positif si stats1.goalDifference > stats0.goalDifference
     * - zÃ©ro si stats1.goalDifference == stats0.goalDifference
     * 
     * @param stats0 PremiÃ¨re statistique Ã  comparer
     * @param stats1 DeuxiÃ¨me statistique Ã  comparer
     * @returns Un nombre positif ou nÃ©gatif en fonction de l'ordre des deux statistiques
     */
    compareTeamStatistics(stats0: TeamStatistics, stats1: TeamStatistics): number {
        if(stats0.pointCount != stats1.pointCount)
            return stats1.pointCount - stats0.pointCount;
        return stats1.goalDifference - stats0.goalDifference;
    }
}