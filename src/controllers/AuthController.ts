import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/auth/User';
import { AuthModel } from '../models/auth/AuthModel';
import * as ExpressBrute from 'express-brute';

export class AuthController {
    private authModel : AuthModel;
    private logInRedirection : string;
    private authUrl: string;

    constructor(authModel : AuthModel, authUrl : string, logInRedirection : string) {
        this.authModel = authModel;
        this.authUrl = authUrl;
        this.logInRedirection = logInRedirection;
    }

    router() : Router {
        const store = new ExpressBrute.MemoryStore(); 
        const bruteForce = new ExpressBrute(store, {
            freeRetries : 5,
            minWait : 1*1000,      // 1 seconde  
            maxWait : 15*60*1000,  // 15 minutes
            failCallback : this.bruteForceCallback.bind(this)
        });

        const router = Router();
        router.get('/signUp', this.getSignUp.bind(this));
        router.post('/signUp', this.postSignUp.bind(this));
        router.post('/logIn', bruteForce.prevent, this.postLogIn.bind(this));
        router.get('/logIn', this.getLogIn.bind(this));
        router.post('/logIn', this.postLogIn.bind(this));
        router.use(this.redirectUnloggedUser.bind(this));
        router.get('/logOut', this.getLogOut.bind(this));
        return router;
    }

    public async getUser(request: Request, response: Response, next : NextFunction): Promise<void> {
      try {
          const user : User | null = (request.session && request.session.userId)
              ?  await this.authModel.getUserFromId(request.session.userId)
              : null;
          response.locals.loggedUser = user;
          next();
      } catch (error) {
          next(error);
      }
    }

    public async redirectUnloggedUser(request: Request, response: Response, next : NextFunction): Promise<void> {
      if (response.locals.loggedUser == null) {
          response.redirect(this.authUrl+'/logIn');
          return;
      }
      next();
    }

    private async getSignUp(request: Request, response: Response, next : NextFunction): Promise<void> {
        response.render('signUp', { 
            csrf : request.csrfToken(),
            logInData : {} });
    }

    private async postSignUp(request: Request, response: Response, next : NextFunction): Promise<void> {
        if (!request.session) throw new Error('Cookies must be enabled');
        try {
            const userId = await this.authModel.signUp(request.body);
            request.session.userId = userId;
            response.redirect(this.logInRedirection);
        } catch (errors) {
            response.render('signUp', { logInData : request.body, errors : errors });
        }
    }

    private async getLogIn(request: Request, response: Response, next : NextFunction): Promise<void> {
        
        response.render('logIn', { 
            csrf : request.csrfToken(),
            logInData : {} 
        });
    }

    private async postLogIn(request: Request, response: Response, next : NextFunction): Promise<void> {
        if (!request.session) throw new Error('Cookies must be enabled');
        try {
            const userId = await this.authModel.getUserId(request.body);
            request.session.userId = userId;
            response.redirect(this.logInRedirection);
        } catch (errors) {
            response.render('logIn', { logInData : request.body, errors : errors });
        }
    }

    private async getLogOut(request: Request, response: Response, next : NextFunction): Promise<void> {
        if (!request.session) throw new Error('Cookies must be enabled');
        request.session.destroy(()=>{
            response.redirect('/');
        });
    }

    private bruteForceCallback(request : Request, response : Response, next : NextFunction, nextValidRequestDate : Date) {
        next(new Error("Too many failed attempts in a short period of time"));
    };
}