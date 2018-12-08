import { Team } from "./Team";
import { Match } from "./Match";
import { AsyncModel } from "./AsyncModel";
import { ModelImpl } from "./ModelImpl";
import { Model } from "./Model";
import { Db, ObjectId } from 'mongodb';
import { Article } from "./Article";
import { MyModelImpl } from "./MyModelImpl";
import { MyModel } from "./MyModel";
import { MyAsyncModel } from "./MyAsyncModel";


export class MyAsyncModelImpl implements MyAsyncModel {
    private db : Db;
    
    /**
     * Construit un modèle asynchrone.
     * 
     * @param db Base de donnÃ©es.
     */
    constructor(db : Db) {
        this.db = db;
    }

    /**
     * @see AsyncModel#articles
     */ 
    async articles(): Promise<Article[]> {
        return this.db.collection<Article>('lists').find().toArray();
    }

    /**
     * @see AsyncModel#article
     */
    async article(id: any): Promise<Article> {
        const article = await this.db.collection<Article>('articles').findOne({_id : new ObjectId(id)});
        if(article == null){
            throw new Error('Team not found');
        }
        return article;
    }

}