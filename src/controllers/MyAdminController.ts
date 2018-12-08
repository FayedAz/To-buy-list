import { Router, Request, Response, NextFunction } from 'express';
import { MyAdminModel } from "../models/admin/MyAdminModel";
import { AsyncModel } from '../models/AsyncModel';
import * as dateFormat from 'dateformat';
import { AuthController } from './AuthController';
import { MyAsyncModel } from '../models/MyAsyncModel';
import { MyAsyncModelImpl } from '../models/MyAsyncModelImpl';
import { request } from 'http';
import { Db } from 'mongodb';


export class MyAdminController {
    private adminModel : MyAdminModel;
    private model : MyAsyncModel;
    private db : Db;

    constructor(adminModel : MyAdminModel, model: MyAsyncModel, db : Db) {
        this.adminModel = adminModel;
        this.model = model;
        this.db = db;
    }


/* .... */

    router(authController : AuthController) : Router {
        const router = Router();
        router.use(authController.redirectUnloggedUser.bind(authController));
        router.get('/', this.getAccountPanel.bind(this));
        router.post('/article', this.postArticle.bind(this));
        /* router.post('/matches', this.postMatch.bind(this)); */
        return router;
    }

    private async getAccountPanel(request: Request, response: Response, next : NextFunction): Promise<void> {
        await this.renderAccountPanel(request, response, {}, undefined);
    }

    private async postArticle(request: Request, response: Response, next : NextFunction): Promise<void> {
        try {
            await this.adminModel.addArticle(request.body);
            response.redirect(request.baseUrl);
            /* TODO : 
             *  - demander au modÃ¨le d'ajouter l'Ã©quipe en fournissant les donnÃ©es prÃ©sentes dans request.body
             *  - rediriger l'utilisateur vers l'URL de base du routeur associÃ©e Ã  ce contrÃ´leur (request.baseUrl)
             */
        } catch (errors) {
            await this.renderAccountPanel(request, response, request.body, errors);
        }
    } 
    
    /*private async postMatch(request: Request, response: Response, next : NextFunction): Promise<void> {
        try {
            await this.adminModel.addMatch(request.body);
            response.redirect(request.baseUrl);
        } catch (errors) {
            await this.renderAdminPanel(request, response, {}, request.body, errors);
        }
    } */

    private async deleteArticle(request: Request, response: Response, next : NextFunction): Promise<void> {
        try {
            await this.adminModel.deleteArticle(request.body);
            response.redirect(request.baseUrl);
        } catch (errors) {
            await this.renderAccountPanel(request, response, {}, errors);
        }
    } 

    private async renderAccountPanel(request : Request, response: Response, articleData : any, errors : any) : Promise<void> {
        const articles = await this.model.articles();
        const list = new MyAsyncModelImpl(this.db);
        const table = await list.articles();
        /*const matches = await this.model.matches();*/
        response.render('accountPanel', {
            csrf : request.csrfToken(),
            articles : articles, 
            dateFormat: dateFormat, 
            articleData : articleData,
            errors : errors,
            table : table
        });
    }

}