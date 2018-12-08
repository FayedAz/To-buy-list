import { Article } from "./Article";

export interface MyModel {
    /**
     * Retourne la liste des artices.
     * 
     * @returns La liste des articles.
     */
    articles() : Article[];
}