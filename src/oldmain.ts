import * as express from "express";
import * as i18n from "i18n";
import * as bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import { AsyncModelImpl } from "./models/AsyncModelImpl";
import { AsyncController } from "./controllers/AsyncController";
import { Request, Response, NextFunction } from "express";
import { AdminModelImpl } from "./models/admin/AdminModelImpl";
import { AdminController } from "./controllers/AdminController";
import * as session from "express-session";
import { AuthModelImpl } from "./models/auth/AuthModelImpl";
import { AuthController } from "./controllers/AuthController";
import * as helmet from "helmet";
import * as cookieParser from "cookie-parser";
import * as csrf from "csurf";
import * as dotenv from 'dotenv';
import connectMongodbSession = require('connect-mongodb-session');
import { MyAsyncController } from './controllers/MyAsyncController';
import { MyAsyncModelImpl } from './models/MyAsyncModelImpl';


i18n.configure({
    locales: ['fr'],
    directory: './locales'
});

function handleError404(request: Request, response: Response, next: NextFunction): void {
    response.status(404).render('error404');
}

function handleError500(error: any, request: Request, response: Response, next: NextFunction): void {
    response.status(500).render('error500');
}

async function start(){
    if (process.env.NODE_ENV=='development') { dotenv.config(); }

    const port = process.env.PORT;
    const mongodbURI = process.env.MONGODB_URI;
    const cookieSecretKey = process.env.COOKIE_SECRET_KEY;
    const secureCookie = process.env.SECURE_COOKIE == 'false' ? false : true;

    if (port == undefined || mongodbURI == undefined || cookieSecretKey == undefined) {
        console.error('PORT, MONGODB_URI and COOKIE_SECRET_KEY environment variables must be defined.')
        return;
    }

    
    const mongoClient = await MongoClient.connect(mongodbURI, { useNewUrlParser: true });
    const db = mongoClient.db('soccer');

    const model = new AsyncModelImpl(db);
    const controller = new AsyncController(model);

    const adminModel = new AdminModelImpl(db, model);
    const adminController = new AdminController(adminModel, model);

    const authModel = new AuthModelImpl(db);
    const authController = new AuthController(authModel, '/auth', '/admin');

    const myExpress = express();
    myExpress.set('view engine', 'pug');
    myExpress.use(i18n.init);
    myExpress.use(bodyParser.urlencoded({ extended: true }));

    myExpress.use(helmet());
    myExpress.use(helmet.contentSecurityPolicy({
        directives: { defaultSrc: ["'self'"], styleSrc: ["'self'"] }
    }));
    const MongoDBStore = connectMongodbSession(session);
    const sessionStore =  new MongoDBStore({ 
        uri : mongodbURI, 
        databaseName: 'soccer', 
        collection : 'sessions' });

    myExpress.use(session({
        secret: cookieSecretKey,
        resave: true,
        saveUninitialized: true,
        store : sessionStore, 
        cookie: { 
            httpOnly : true,
            sameSite : true,
            secure: secureCookie 
        }}));


    myExpress.use(cookieParser());
    myExpress.use(csrf({ cookie: { key: cookieSecretKey,
                                   secure: secureCookie,   
                                   httpOnly: true, 
                                   sameSite: true,
                                   maxAge: 3600000 } }));

    myExpress.use(express.static('static'));

    myExpress.use(authController.getUser.bind(authController));

    myExpress.use(controller.router());
    myExpress.use('/', controller.router());
    myExpress.use('/auth', authController.router());
    myExpress.use('/admin', adminController.router(authController));
    myExpress.use(handleError404);

    // if(process.env.NODE_ENV != 'development')
    //     myExpress.use(handleError500);

    myExpress.listen(port, function(){ console.log('Go to http://localhost:' + port) });
}

start();