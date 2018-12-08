import { Model } from "./Model";
import { Team } from "./Team";
import { Match } from "./Match";

export class ModelImpl implements Model {
    private teams_ : Team[];
    private matches_ : Match[];

    /**
     * Construit un modÃ¨le Ã  partir d'Ã©quipes et de matchs.
     * 
     * @param teams Les Ã©quipes Ã  ajouter au modÃ¨le.
     * @param matches Les matchs Ã  ajouter au modÃ¨le.
     */
    constructor(teams : Team[], matches : Match[]) {
        this.teams_ = teams;
        this.matches_ = matches;
    }

    /**
     * @see Model#teams
     */
    teams(): Team[] {
        return this.teams_;
    }    
    
    /**
     * @see Model#matches
     */
    matches(): Match[] {
        return this.matches_;
    }

    /**
     * @see Model#team
     */
    team(id: any): Team {
        for (const team of this.teams()){
            if(team._id.equals(id)) {return team;}
        }
        throw new Error('Team not found');
    }

    /**
     * @see Model#matchesForTeam
     */
    matchesForTeam(team: Team): Match[] {
        const matches : Match[] = [];
        for(const match of this.matches()){
            if(team._id.equals(match.teams[0]._id) || team._id.equals(match.teams[1]._id)){
                matches.push(match);
            }
        }
        return matches;
    }
}