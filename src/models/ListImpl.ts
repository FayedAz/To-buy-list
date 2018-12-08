import { MyModel } from './MyModel';
import { Article } from './Article';
import { List } from './List';
import { MyAsyncModel } from './MyAsyncModel';
 

export class ListImpl implements List {
    /**
     * @see Ranking#table
     */
    table : Article[];

    /**
     * Construit une liste en utilisant les donnÃ©es du modÃ¨les.
     * 
     * @param model ModÃ¨le contenant les donnÃ©es 
     *                    pour rÃ©aliser la liste.
     */
    constructor(model: MyModel) {
        this.table = [];
        this.fillTable(model);
    }

    /**
     * Remplit le tableau table avec les articles.
     * 
     * @param model modèle contenant les données.
     */
    fillTable(model : MyModel) : void {
        for(const article of model.articles()){
            this.table.push(article);
        }
    }

}