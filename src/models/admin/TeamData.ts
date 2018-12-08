import { MinLength, MaxLength, IsString} from "class-validator";
import { Expose } from "class-transformer";

/**
 * Classe décrivant la structure des données nécessaires
 * à l'ajout d'une nouvelle équipe.
 */
export class TeamData {

  /**
   * Nom de l'équipe
   */
  @Expose()
  @IsString()
  @MinLength(3, {message : "Team's name is too short"})
  @MaxLength(20, {message : "Team's name is too long"})
  name: string;

  constructor() {
      this.name = '';
  }

}