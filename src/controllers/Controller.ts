import { Model } from "../models/Model";
import { Ranking } from "../models/Ranking";
import { RankingImpl } from "../models/RankingImpl";
import { Request, Response, NextFunction, Router } from 'express';
import * as dateFormat from "dateformat";
import { TeamStatisticsImpl } from "../models/TeamStatisticsImpl";

export class Controller {
    private model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    router(): Router {
        const router = Router();
        router.get('/', this.getRanking.bind(this));
        router.get('/team/:teamId', this.getTeam.bind(this));
        return router;
    }

    private getRanking(request: Request, response: Response, next : NextFunction): void {
      const ranking = new RankingImpl(this.model);
      const table = ranking.table;
      response.render('ranking', { table: table });
    }



/* ... */

    private getTeam(request: Request, response: Response, next : NextFunction): void {
    const team = this.model.team(request.params.teamId);
    const matches = this.model.matchesForTeam(team);
    response.render('team', {
        team: team,
        matches: matches,
        statistics: new TeamStatisticsImpl(team, matches),
        dateFormat: dateFormat
    });
}
}