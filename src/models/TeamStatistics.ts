import { Team } from "./Team";

export interface TeamStatistics {
    /**
     * Équipe associée aux statistiques.
     */
    team: Team;
  
    /**
     * Nombre de matchs joués.
     */
    playedMatchCount: number;
  
    /**
     * Nombre de matchs gagnés.
     */
    wonMatchCount: number;
  
    /**
     * Nombre de matchs nuls.
     */
    drawMatchCount: number;
  
    /**
     * Nombre de matchs perdus.
     */
    lostMatchCount: number;
  
    /**
     * Nombre de buts marqués.
     */
    goalForCount: number;
  
    /**
     * Nombre de buts encaissés.
     */
    goalAgainstCount: number;
  
    /**
     * Différence de buts.
     */
    goalDifference: number;
  
    /**
     * Nombre de points.
     */
    pointCount: number;
}