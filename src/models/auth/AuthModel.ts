import { User } from "./User";

export interface AuthModel {
    /**
     * Enregistre un utilisateur avec les informations contenues dans 
     * l'objet passé en paramètre.
     * 
     * Une exception est levée si les contraintes
     * de longueur de nom d'utilisateur et de mot
     * de passe ne sont pas respectées ou si
     * le nom d'utilisateur est déjà pris.
     * 
     * @param logInData Informations nécessaires à l'enregistrement (voir LogInData)
     * @returns Une promesse d'avoir l'identifiant du nouvel utilisateur
     */
    signUp(data: any): Promise<any>;

    /**
     * Récupère l'identifiant d'un utilisateur
     * à partir des informations passées en paramètre.
     * 
     * Une exception est levée si les contraintes
     * de longueur de nom d'utilisateur et de mot
     * de passe ne sont pas respectées ou si
     * le nom d'utilisateur ou le mot de passe
     * ne sont pas corrects.
     * 
     * @param logInData Informations nécessaires à la connexion (voir LogInData)
     * @returns Une promesse d'avoir l'identifiant de l'utilisateur
     */
    getUserId(data: any): Promise<any>;

    /**
     * Récupère un objet contenant les informations
     * liées à un utilisateur à partir de son identifiant. 
     * 
     * Une exception est levée si l'identifiant n'est
     * pas valide ou si l'utilisateur n'existe pas.
     * 
     * @param id Identifiant de l'utilisateur.
     * @returns Une promesse d'avoir un objet représentant l'utilisateur
     */
    getUserFromId(id : any) : Promise<User>;

}