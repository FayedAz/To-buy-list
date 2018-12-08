import { TeamStatistics } from "./TeamStatistics";

export interface Ranking {
    /**
     * Tableau contenant les statistiques des équipes triés
     * dans l'ordre du classement.
     */
    table : TeamStatistics[];
}   