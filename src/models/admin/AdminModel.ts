export interface AdminModel {
    /**
     * Ajoute une équipe au modèle à partir des informations
     * passées en paramètre. Une exception est levée si 
     * l'équipe ne peut pas être ajoutée.
     * 
     * @param data Données décrivant l'équipe à ajouter (voir TeamData)
     * @returns Une promesse d'avoir l'identifiant de l'équipe créée
     */
    addTeam(data : any): Promise<any>;

    /**
     * Ajoute un match au modèle à partir des informations
     * passées en paramètre. Une exception est levée si 
     * le match ne peut pas être ajouté.
     * 
     * @param data Données décrivant le match à ajouter (voir MatchData)
     * @returns Une promesse d'avoir l'identifiant du match créé
     */
    addMatch(data : any): Promise<any>;

    /**
     * Supprime un match. Une Exception est levée si
     * le match ne peut pas être supprimé
     * 
     * @param data Données contenant l'identitfiant du match à supprimer
     *              (Voir DeleteMatchData)
     * 
     */
    deleteMatch(data : any): Promise<void>;
}