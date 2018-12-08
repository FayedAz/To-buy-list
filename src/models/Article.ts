
import { Double } from "bson";

export interface Article {
    /**
     * id de l'article
     */
    _id: any;

    /**
     * Liste à laquelle appartient l'article
     */
    user: any;
    /**
     * Nom de l'article.
     */
    name: string;
  
    /**
     * Quantité de l'article à acheter.
     */
    qty: Double;

    /**
     * Mesure de la quantité.
     */
    measure: string;

    /**
     * Etat de l'article
     */

    bought: boolean;
}