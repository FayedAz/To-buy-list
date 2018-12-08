import { MyModel } from "../models/MyModel";
import { Request, Response, NextFunction, Router } from 'express';
import { ListImpl } from "../models/ListImpl"; 
import { AsyncModel } from '../models/AsyncModel';

export class MyController {
    private model: MyModel;

    constructor(model: MyModel) {
        this.model = model;
    }

    router(): Router {
        const router = Router();
        router.get('/', this.getList.bind(this));
        return router;
    }

    private getList(request: Request, response: Response, next : NextFunction): void {
      const list = new ListImpl(this.model);
      const table = list.table;
      response.render('list', { table: table });
    }
    
}