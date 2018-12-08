import { MyModel } from "./MyModel";
import { Article } from "./Article";

export class MyModelImpl implements MyModel {
    private articles_ : Article[];

    /**
     * Construit un modèle à partir d'articles
     * 
     * @param articles Les articles à ajouter au model
     */
    constructor(articles : Article[]) {
        this.articles_ = articles;
    }

    /**
     * @see Model#teams
     */
    articles(): Article[] {
        return this.articles_;
    }    

    /**
     * @see Model#team
     */
    article(id: any): Article {
        for (const article of this.articles()){
            if(article._id.equals(id)) {return article;}
        }
        throw new Error('Article not found');
    }

}