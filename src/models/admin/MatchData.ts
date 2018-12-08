import { IsMongoId, IsISO8601, IsNumberString} from "class-validator";
import { Expose } from "class-transformer";

/**
 * Classe décrivant la structure des données nécessaires
 * à l'ajout d'un nouveau match.
 */
export class MatchData {

  @Expose()
  @IsISO8601()
  date: string;

  @Expose()
  @IsMongoId()
  team0 : string;
  
  @Expose()
  @IsMongoId()
  team1 : string;

  @Expose()
  @IsNumberString()
  score0 : string;

  @Expose()
  @IsNumberString()
  score1 : string;

  constructor() {
      this.date ='';
      this.team0 = '';
      this.team1 = '';
      this.score0 = '';
      this.score1 = '';
  }

}