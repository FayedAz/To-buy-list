import { Team } from "./Team";
import { Match } from "./Match";
import { AsyncModel } from "./AsyncModel";
import { ModelImpl } from "./ModelImpl";
import { Model } from "./Model";
import { Db, ObjectId } from 'mongodb';

export class AsyncModelImpl implements AsyncModel {
    private db : Db;
    
    /**
     * Construit un modÃ¨le asynchrone.
     * 
     * @param db Base de donnÃ©es.
     */
    constructor(db : Db) {
        this.db = db;
    }

    /**
     * @see AsyncModel#teams
     */ 
    async teams(): Promise<Team[]> {
        return this.db.collection<Team>('teams').find().toArray();
    }
    
    /**
     * @see AsyncModel#matches
     */
    async matches(): Promise<Match[]> {
        const matches = await this.db.collection<Match>('matches').find().toArray();
        await this.populateMatches(matches);

        return matches;
    }

    /**
     * @see AsyncModel#team
     */
    async team(id: any): Promise<Team> {
        const team = await this.db.collection<Team>('teams').findOne({_id : new ObjectId(id)});
        if(team == null){
            throw new Error('Team not found');
        }
        return team;
    }

    /**
     * @see AsyncModel#matchesForTeam
     */
    async matchesForTeam(team: Team): Promise<Match[]> {
        /* TODO */

        const matches = await this.db.collection<Match>('matches').find({teams : team._id}).toArray();
        await this.populateMatches(matches);

        return matches;
    }

    /**
     * @see AsyncModel#model
     */
    async model(): Promise<Model> {
        return new ModelImpl(await this.teams(), await this.matches());
    }

    /**
     * Remplace les identifiants des Ã©quipes par les Ã©quipes
     * dans les matches passÃ©s en paramÃ¨tre.
     * 
     * @param matches Matchs Ã  traiter.
     */
    private async populateMatches(matches : Match[]) : Promise<void> {
        for (const match of matches) {
            match.teams = [await this.team(match.teams[0]), await this.team(match.teams[1])];
        }
    }

}