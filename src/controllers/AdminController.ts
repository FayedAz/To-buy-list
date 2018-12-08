import { Router, Request, Response, NextFunction } from 'express';
import { AdminModel } from "../models/admin/AdminModel";
import { AsyncModel } from '../models/AsyncModel';
import * as dateFormat from 'dateformat';
import { AuthController } from './AuthController';
import { request } from 'http';


export class AdminController {
    private adminModel : AdminModel;
    private model : AsyncModel;

    constructor(adminModel : AdminModel, model: AsyncModel) {
        this.adminModel = adminModel;
        this.model = model;
    }


/* .... */

    router(authController : AuthController) : Router {
        const router = Router();
        router.use(authController.redirectUnloggedUser.bind(authController));
        router.get('/', this.getAdminPanel.bind(this));
        router.post('/teams', this.postTeam.bind(this));
        router.post('/matches', this.postMatch.bind(this));
        router.post('/deleteMatch', this.deleteMatch.bind(this))
        return router;
    }

    private async getAdminPanel(request: Request, response: Response, next : NextFunction): Promise<void> {
        await this.renderAdminPanel(request, response, {}, {}, undefined);
    }

    private async postTeam(request: Request, response: Response, next : NextFunction): Promise<void> {
        try {
            await this.adminModel.addTeam(request.body);
            response.redirect(request.baseUrl);
            /* TODO : 
             *  - demander au modÃ¨le d'ajouter l'Ã©quipe en fournissant les donnÃ©es prÃ©sentes dans request.body
             *  - rediriger l'utilisateur vers l'URL de base du routeur associÃ©e Ã  ce contrÃ´leur (request.baseUrl)
             */
        } catch (errors) {
            await this.renderAdminPanel(request, response, request.body, {}, errors);
        }
    } 
    
    private async postMatch(request: Request, response: Response, next : NextFunction): Promise<void> {
        try {
            await this.adminModel.addMatch(request.body);
            response.redirect(request.baseUrl);
        } catch (errors) {
            await this.renderAdminPanel(request, response, {}, request.body, errors);
        }
    } 

    private async deleteMatch(request: Request, response: Response, next : NextFunction): Promise<void> {
        try {
            await this.adminModel.deleteMatch(request.body);
            response.redirect(request.baseUrl);
        } catch (errors) {
            await this.renderAdminPanel(request, response, {}, {}, errors);
        }
    } 

    private async renderAdminPanel(request : Request, response: Response, teamData : any, matchData : any, errors : any) : Promise<void> {
        const teams = await this.model.teams();
        const matches = await this.model.matches();
        response.render('adminPanel', {
            csrf : request.csrfToken(),
            teams : teams, 
            matches : matches, 
            dateFormat: dateFormat, 
            teamData : teamData,
            matchData : matchData,
            errors : errors
        });
    }

}