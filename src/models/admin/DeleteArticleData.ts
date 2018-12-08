import { IsMongoId, IsISO8601, IsNumberString} from "class-validator";
import { Expose } from "class-transformer";

/**
 * Classe décrivant la structure des données nécessaires
 * à l'ajout d'un nouveau match.
 */
export class DeleteArticleData {

  @Expose()
  @IsISO8601()
  id: string;

  constructor() {
      this.id ='';
  }

}