import { User } from "./User";
import { Db, ObjectID } from "mongodb";
import * as bcrypt from "bcrypt";
import { validate } from "class-validator";
import { LogInData } from "./LogInData";
import { AuthModel } from "./AuthModel";
import { plainToClass } from "class-transformer";
import { EROFS } from "constants";
import { userInfo } from "os";

export class AuthModelImpl implements AuthModel {
    private db : Db;
    
    /**
     * Construit un modÃ¨le asynchrone.
     * 
     * @param db Base de donnÃ©es.
     */
    constructor(db : Db) {
        this.db = db;
    }

    /**
     * @see AuthModel#signUp
     */
    async signUp(data: any): Promise<any> {
        const logInData : LogInData = plainToClass<LogInData, object>(LogInData, data, {strategy : 'excludeAll' });
        await this.validate(logInData);
        
        const user = await this.db.collection('users').findOne({username : logInData.username});
        if(user != null){
            throw new Error('Username already exists');          
        }
        const hash = await bcrypt.hash(logInData.password, 10);
        const result = await this.db.collection('users').insertOne({
            username : logInData.username,
            password : hash
        });

        return result.insertedId;
    }    
    
    /**
     * @see AuthModel#getUserId
     */
    async getUserId(data: any): Promise<any> {
        const logInData : LogInData = plainToClass<LogInData, object>(LogInData, data, {strategy : 'excludeAll' });
        await this.validate(logInData);
        const user = await this.db.collection('users').findOne({username : logInData.username});
        if(user == null) {
            throw new Error('username or password are not correct');
        }
        if(!await bcrypt.compare(logInData.password, user.password)){
            throw new Error('Username or password are not correct');
        }
        return user._id;
    }

    /**
     * @see AuthModel#getUserFromId
     */
    async getUserFromId(id : any) : Promise<User> {
        const user = await this.db.collection('users').findOne({_id : new ObjectID(id)});
        if(user == null) {
            throw new Error('User not found');
        }
        delete user.password;
        return user;

        throw new Error('Not implemented');
    }

    /**
     * 
     * LÃ¨ve une exception si l'objet passÃ© en paramÃ¨tre n'a pas pu Ãªtre validÃ©.
     * 
     * @param object Objet Ã  valider
     */
    private async validate(object : any) : Promise<void> {
        const errors = await validate(object);
        if (errors.length == 0) return;
        throw errors;
    }
}