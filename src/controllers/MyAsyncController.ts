import { RankingImpl } from "../models/RankingImpl";
import { Request, Response, NextFunction, Router } from 'express';
import * as dateFormat from 'dateformat';
import { AsyncModel } from "../models/AsyncModel";
import { TeamStatisticsImpl } from "../models/TeamStatisticsImpl";
import { ListImpl } from '../models/ListImpl';
import { MyAsyncModelImpl } from '../models/MyAsyncModelImpl';
import { MyAsyncModel } from '../models/MyAsyncModel';
import { Db, ObjectId } from 'mongodb';

export class MyAsyncController {
    private db : Db;

    constructor(db: Db) {
        this.db = db;
    }

    router() {
        const router = Router();
        router.get('/', this.getList.bind(this));
        return router;
    }

    private async getList(request: Request, response: Response, next : NextFunction): Promise<void> {
        try {
            const list = new MyAsyncModelImpl(this.db);
            const table = await list.articles();
            response.render('index');
        } catch (exception) {
            next(exception);
        }
    }

}