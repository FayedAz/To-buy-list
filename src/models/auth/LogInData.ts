import { MinLength, MaxLength, IsString, IsAlphanumeric, Matches} from "class-validator";
import { Expose } from "class-transformer";

/**
 * Classe permettant de communiquer les informations
 * nÃ©cessaire Ã  l'inscription et la connexion d'un 
 * administrateur.
 */
export class LogInData {
  /**
   * Nom d'utilisateur
   */
  @Expose()
  @IsString()
  @MinLength(3, { message : 'Username is too short' })
  @MaxLength(20, { message : 'Username is too long' })
  @IsAlphanumeric()
  username: string;

  /**
   * Mot de passe
   */
  @Expose()
  @IsString()
  @MinLength(3, { message : 'Password is too short' })
  @MaxLength(20, { message : 'Password is too long' })
  @Matches(/^\S*$/)
  password : string;

  constructor() {
      this.username = "";
      this.password = "";
  }
}