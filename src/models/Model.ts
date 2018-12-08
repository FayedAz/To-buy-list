import { Team } from "./Team";
import { Match } from "./Match";

export interface Model {
    /**
     * Retourne la liste des équipes.
     * 
     * @returns La liste des équipes.
     */
    teams() : Team[];

    /**
     * Retourne la liste des matchs.
     *
     * @returns La liste des matchs.
     */
    matches() : Match[];

    /**
     * Retourne l'équipe qui possède l'identifiant passé 
     * en paramètre. Si elle n'existe pas, une exception
     * est lancée avec le message 'Team not found'.
     * Les identifiants sont comparés avec la méthode 
     * <code>id.equals(other.id)</code>.
     * 
     * @param id Identifiant de l'équipe à trouver.
     */
    team(id : any): Team;

    /**
     * Retourne la liste des matchs joués par 
     * l'équipe passé en paramètre. 
     * Les identifiants des équipes sont utilisés 
     * et comparés avec la méthode 
     * <code>id.equals(other.id)</code>.
     * 
     * @param team Équipe qui doit participer 
     *             aux matchs retournés.
     */
    matchesForTeam(team : Team) : Match[];
}