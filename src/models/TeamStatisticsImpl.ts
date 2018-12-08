import { Team } from "./Team";
import { Match } from "./Match";
import { TeamStatistics } from "./TeamStatistics";

export class TeamStatisticsImpl implements TeamStatistics {
  /**
   * @see Team#team
   */
  team: Team;

  /**
   * @see Team#playedMatchCount
   */
  playedMatchCount: number;

  /**
   * @see Team#wonMatchCount
   */
  wonMatchCount: number;

  /**
   * @see Team#drawMatchCount
   */
  drawMatchCount: number;

  /**
   * @see Team#lostMatchCount
   */
  lostMatchCount: number;

  /**
   * @see Team#goalForCount
   */
  goalForCount: number;

  /**
   * @see Team#goalAgainstCount
   */
  goalAgainstCount: number;

  /**
   * @see Team#goalDifference
   */
  goalDifference: number;

  /**
   * @see Team#pointCount
   */
  pointCount: number;

  constructor(team: Team, matches: Match[]) {
    this.team = team;
    this.playedMatchCount = 0;
    this.wonMatchCount = 0;
    this.drawMatchCount = 0;
    this.lostMatchCount = 0;
    this.goalForCount = 0;
    this.goalAgainstCount = 0;
    this.goalDifference = 0;
    this.pointCount = 0;
    this.addMatches(matches);
  }

  /**
   * Ajoute l'intÃ©gralitÃ© des matchs aux statistiques.
   *
   * @param matches Matchs Ã  ajouter.
   */
  addMatches(matches: Match[]): void {
    for(const match of matches){
        this.addMatch(match);
    }
  }

  /**
   * Ajoute une victoire :
   *   - un nouveau match jouÃ© ;
   *   - une victoire ;
   *   - 3 points.
   */
  addWonMatch(): void {
    this.playedMatchCount++;
    this.wonMatchCount++;
    this.pointCount += 3;
  }

  /**
   * Ajoute une dÃ©faite :
   *   - un nouveau match jouÃ© ;
   *   - une dÃ©faite.
   */
  addLostMatch(): void {
    this.playedMatchCount++;
    this.lostMatchCount++;
  }

  /**
   * Ajoute un match nul  :
   *   - un nouveau match jouÃ© ;
   *   - un match nul ;
   *   - 1 point.
   */
  addDrawMatch(): void {
    this.playedMatchCount++;
    this.drawMatchCount++;
    this.pointCount++;
  }

  /**
   * Ajoute des buts marquÃ©s :
   *  - modification du nombre de buts marquÃ©s
   *  - modification de la diffÃ©rence de buts
   * 
   * @param count Nombre de buts 
   */
  addGoalsFor(count: number): void {
    this.goalForCount = this.goalForCount + count;
    this.goalDifference = this.goalDifference + count;
  }

  /**
   * Ajoute des buts encaissÃ©s :
   *  - modification du nombre de buts encaissÃ©s
   *  - modification de la diffÃ©rence de buts
   * 
   * @param count Nombre de buts 
   */
  addGoalsAgainst(count: number): void {
    this.goalAgainstCount += count;
    this.goalDifference -= count;
  }

  /**
   * Ajoute un match aux statistiques.
   * 
   * @param match Match Ã  considÃ©rer
   */
  addMatch(match: Match): void {
    const position = match.teams[0]._id.equals(this.team._id) ? 0 : 1;
    const goalFor = match.scores[position];
    const goalAgainst = match.scores[1 - position];
    this.addGoalsFor(goalFor);
    this.addGoalsAgainst(goalAgainst);
    if (goalFor > goalAgainst){ this.addWonMatch(); } 
    else if (goalAgainst > goalFor){ this.addLostMatch(); }
    else { this.addDrawMatch(); }
  }
}