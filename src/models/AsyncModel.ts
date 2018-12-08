import { Team } from "./Team";
import { Match } from "./Match";
import { Model } from "./Model";

export interface AsyncModel {
    /**
     * Retourne une promesse d'avoir la liste des équipes.
     * 
     * @returns une promesse d'avoir liste des équipes.
     */
    teams() : Promise<Team[]>;

    /**
     * Retourne la liste des matchs.
     *
     * @returns une promesse d'avoir la liste des matchs.
     */
    matches() : Promise<Match[]>;

    /**
     * Retourne une promesse d'avoir l'équipe qui possède 
     * l'identifiant passé en paramètre. Si elle n'existe 
     * pas, une exception sera lancée avec le message 
     * 'Team not found'.
     * 
     * @param id Identifiant de l'équipe à trouver.
     * @returns une promesse d'avoir l'équipe
     */
    team(id : any): Promise<Team>;

    /**
     * Retourne une promesse d'avoir la liste des matchs joués 
     * par l'équipe passé en paramètre. 
     * 
     * @param team Équipe qui doit participer 
     *             aux matchs retournés.
     * @returns une promesse d'avoir la liste de matchs.
     */
    matchesForTeam(team : Team) : Promise<Match[]>;

    /**
     * Retourne une promesse d'avoir une objet 
     * implémentant l'interface synchrone du modèle.
     * 
     * @returns une promesse d'avoir un modèle synchrone.
     */
    model() : Promise<Model>;
}