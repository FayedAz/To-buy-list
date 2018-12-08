import * as express from "express";
import * as i18n from "i18n";
import { MongoClient } from "mongodb";
import { MyAsyncModelImpl } from "./models/MyAsyncModelImpl";
import { MyAsyncController } from "./controllers/MyAsyncController";
import { Request, Response, NextFunction } from "express";
import * as session from "express-session";
import { AuthModelImpl } from "./models/auth/AuthModelImpl";
import { AuthController } from "./controllers/AuthController";
import * as bodyParser  from "body-parser";
import { MyAdminController } from "./controllers/MyAdminController";
import { MyAdminModelImpl } from "./models/admin/MyAdminModelImpl";
import * as helmet from "helmet";
import * as cookieParser from "cookie-parser";
import * as csrf from "csurf";
import connectMongodbSession = require('connect-mongodb-session');
import * as dotenv from 'dotenv';

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

async function start()  {
    if (process.env.NODE_ENV=='development') { dotenv.config(); }

    const port = process.env.PORT;
    const mongodbURI = process.env.MONGODB_URI;
    const cookieSecretKey = process.env.COOKIE_SECRET_KEY;
    const secureCookie = process.env.SECURE_COOKIE == 'false' ? false : true;

    console.log(mongodbURI);

    if (port == undefined || mongodbURI == undefined || cookieSecretKey == undefined) {
        console.error('PORT, MONGODB_URI and COOKIE_SECRET_KEY environment variables must be defined.')
        return;
    }

    const mongoClient = await MongoClient.connect(mongodbURI, { useNewUrlParser: true });
    const db = mongoClient.db('soccer');

    const model = new MyAsyncModelImpl(db);
    const controller = new MyAsyncController(db);

    const adminModel = new MyAdminModelImpl(db, model);
    const adminController = new MyAdminController(adminModel, model, db);

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
    myExpress.use(session({ 
        secret: 'zefzefjojv', 
        resave: false, 
        saveUninitialized: true, 
        cookie: { secure: process.env.NODE_ENV == 'production' }}));
    
   

    myExpress.use(cookieParser());
    
    myExpress.use(express.static('static'));
    myExpress.use(authController.getUser.bind(authController));
    myExpress.use(controller.router());
    myExpress.use(csrf({ cookie: { key: 'zejfzejfzejfopjef',
                                   secure: false,   
                                   httpOnly: true, 
                                   sameSite: true,
                                   maxAge: 3600000 } }));

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

    myExpress.use('/', controller.router());
    myExpress.use('/auth', authController.router());
    myExpress.use('/admin', adminController.router(authController));
    /*myExpress.use(handleError404);
    myExpress.use(handleError500);*/
    myExpress.listen(port, function () { console.log('Go to http://localhost:' + port) });
}

start();