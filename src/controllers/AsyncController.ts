import { RankingImpl } from "../models/RankingImpl";
import { Request, Response, NextFunction, Router } from 'express';
import * as dateFormat from 'dateformat';
import { AsyncModel } from "../models/AsyncModel";
import { TeamStatisticsImpl } from "../models/TeamStatisticsImpl";

export class AsyncController {
    private model : AsyncModel;

    constructor(model: AsyncModel) {
        this.model = model;
    }

    router() {
        const router = Router();
        router.get('/', this.getRanking.bind(this));
        router.get('/team/:teamId', this.getTeam.bind(this));
        return router;
    }

    private async getRanking(request: Request, response: Response, next : NextFunction): Promise<void> {
        try {
            const ranking = new RankingImpl(await this.model.model());
            const table = ranking.table;
            response.render('ranking', { table: table });
        } catch (exception) {
            next(exception);
        }
    }

    private async getTeam(request: Request, response: Response, next : NextFunction): Promise<void> {
        try {
            const team = await this.model.team(request.params.teamId);
            const matches = await this.model.matchesForTeam(team);
            response.render('team', {
                team: team,
                matches: matches,
                statistics: new TeamStatisticsImpl(team, matches),
                dateFormat: dateFormat
            });
        } catch (exception) {
            next(exception);
        }
    }
}