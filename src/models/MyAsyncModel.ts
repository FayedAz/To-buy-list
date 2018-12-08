import { Article } from "./Article";
import { MyModel } from "./MyModel";

export interface MyAsyncModel {
    /**
     * Retourne la liste des artices.
     * 
     * @returns La liste des articles.
     */
    articles() : Promise<Article[]>;

    /**
     * Retourne une promesse d'avoir l'article qui possède 
     * l'identifiant passé en paramètre. Si il n'existe 
     * pas, une exception sera lancée avec le message 
     * 'Article not found'.
     * 
     * @param id Identifiant de l'équipe à trouver.
     * @returns une promesse d'avoir l'équipe
     */
    article(id : any): Promise<Article>;
    }