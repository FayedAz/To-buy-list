import { AdminModel } from "./AdminModel";
import { Db, ObjectID } from "mongodb";
import { validate } from "class-validator";
import { TeamData } from "./TeamData";
import { MatchData } from "./MatchData";
import { AsyncModel } from "../AsyncModel";
import { plainToClass } from "class-transformer";
import { DeleteMatchData } from "./DeleteMatchData";
import { Result } from "range-parser";
import { isBuffer } from "util";

export class AdminModelImpl implements AdminModel {
    private db : Db;
    private model : AsyncModel;
    
    /**
     * Construit un modÃ¨le asynchrone.
     * 
     * @param db Base de donnÃ©es.
     * @param model ModÃ¨le asynchrone.
     */
    constructor(db : Db, model : AsyncModel) {
        this.db = db;
        this.model = model;
    }

    /**
    * @see AdminModel#addTeam
    */
    async addTeam(data : any) : Promise<any> {
        const teamData : TeamData = plainToClass<TeamData, object>(TeamData, data, {strategy : 'excludeAll' });
        await this.validate(teamData);
        const result = await this.db.collection('teams').insertOne({
            name: teamData.name
        })
        return result.insertedId;
    }

    /**
    * @see AdminModel#addMatch
    */
    async addMatch(data : any) : Promise<any> {
        const matchData : MatchData = plainToClass<MatchData, object>(MatchData, data, {strategy : 'excludeAll' });
        await this.validate(matchData);
        
        const team0 = await this.model.team(matchData.team0) 
        const team1 = await this.model.team(matchData.team1) 
        
        if(team0._id.equals(team1._id)){
            throw new Error("Teams must be different");            
        }

        const score0 = parseInt(matchData.score0);
        const score1 = parseInt(matchData.score1);

        if(score0 < 0 || score1 < 0){
            throw new Error("Scores must be positive")
        }

        if(score0 > 100 || score1 > 100){
            throw new Error("Scores must be less than or equal to 100")
        }

        const result = await this.db.collection('matches').insertOne({
            date : new Date(matchData.date),
            teams : [team0._id, team1._id],
            scores : [score0, score1]
        })

        return result.insertedId;
    }

    /**
     * 
     * LÃ¨ve une exception si l'objet passÃ© en paramÃ¨tre n'a pas pu Ãªtre validÃ©.
     * 
     * @param object Objet Ã  valider
     */
    private async validate(object : any) : Promise<void> {
        const errors = await validate(object);
        if (errors.length == 0) return;
        throw errors;
    }

    async deleteMatch(data : any): Promise<void>{
        const deleteMatchData : DeleteMatchData = plainToClass<DeleteMatchData, object>(DeleteMatchData, data, {strategy : 'excludeAll' });
        await this.validate(deleteMatchData);
        await this.db.collection('matches').deleteOne({ _id : new ObjectID(deleteMatchData.id)});
    }

}