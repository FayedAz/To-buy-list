import { Team } from "./Team";

export interface Match {
  /**
   * Identifiant du match.
   */
  _id: any;

  /**
   * Date du match.
   */
  date: Date;

  /**
   * Les deux équipes qui s'affrontent.
   */
  teams: [Team, Team];

  /**
   * Le nombre de buts marqués par les deux équipes.
   */
  scores: [number, number];
}