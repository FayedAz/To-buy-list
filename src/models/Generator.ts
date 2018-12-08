import { Team } from "./Team";
import { Match } from "./Match";

class SimpleId {
    private _id : number;

    constructor (id : number) {
        this._id = id;
    }

    equals(id : SimpleId | string) : boolean {
        if (typeof id == 'string') {
            return this._id == parseInt(id);
        }
        return this._id == id._id;
    }

    toString() : string {
        return this._id.toString();
    }
}

class Generator {
    private seed: number;
    teams: Team[];
    matches : Match[];
    
    static teamNames = ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes",
    "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims",
    "Le Havre", "Saint-Ã‰tienne", "Toulon", "Grenoble", "Dijon",
    "Angers", "NÃ®mes", "Villeurbanne"];

    private autumnDates() : Date[] {
        let year = new Date().getUTCFullYear();
        if (new Date(year, 7, 15) >= new Date()) year--;
        let date =new Date(year, 7, 15);
        date.setDate(date.getDate() - date.getDay() - 1);
        const dates : Date[] = [];
        for (let i = 0; i < this.teams.length; i++) {
            dates.push(date);
            date = new Date(date);
            date.setDate(date.getDate() + 7);
        }
        return dates;
    }

    private springDates() : Date[] {
        let year = new Date().getUTCFullYear();
        if (new Date(year, 7, 15) <= new Date()) year++;
        let date =new Date(year, 0, 1);
        date.setDate(date.getDate() - date.getDay() + 6);
        const dates : Date[] = [];
        for (let i = 0; i < this.teams.length; i++) {
            dates.push(date);
            date = new Date(date);
            date.setDate(date.getDate() + 7);
        }
        return dates;
    }

    private createTeams(): void {
        for (const teamName of Generator.teamNames) {
            const team : Team = { _id : new SimpleId(this.teams.length), name : teamName};
            this.teams.push(team);
        }
    }

    private random() {
        let x = Math.sin(this.seed) * 10000;
        this.seed++;
        return x - Math.floor(x);
    }

    private generateMatch(id : any, date : Date, teams : [Team, Team]) : Match {
        const score0 : number = Math.floor((this.random() * 3));
        const score1 : number = Math.floor((this.random() * 3));
        const match : Match = {
            _id : id,
            teams : teams,  
            scores : [score0, score1], 
            date : date
        };
        return match;
    }

    private createHalfSeason(dates : Date[], part: number) : void {
        const list1 = [];
        for (let listIndex = 0; listIndex < this.teams.length / 2; listIndex++) {
            list1.push(this.teams[listIndex]);
        }
        
        const list2 = [];
        for (let listIndex = this.teams.length - 1; listIndex >= this.teams.length / 2; listIndex--) {
            list2.push(this.teams[listIndex]);
        }

        for (let dateIndex = 0; dateIndex < this.teams.length - 1; dateIndex++) {
            const last1 : Team | undefined = list1.pop(); list2.push(last1); 
            const first2  = list2.shift(); 
            const first1  = list1.shift();
            list1.unshift(first1, first2);
            for (let listIndex = 0; listIndex < this.teams.length / 2; listIndex++) {
                const team1 : Team | undefined = list1[listIndex];
                const team2 : Team | undefined = list2[listIndex];
                if (team1 == undefined || team2 == undefined) {
                    throw new Error();
                }
                const id = new SimpleId(this.matches.length);
                const match = (dateIndex % 2 == part) 
                    ? this.generateMatch(id, dates[dateIndex], [team1, team2])
                    : this.generateMatch(id, dates[dateIndex], [team2, team1]);
                this.matches.push(match);
            }
        }
    }

     constructor() {
        this.seed = 0.12;
        this.teams = [];
        this.matches = [];
        this.createTeams();
        this.createHalfSeason(this.autumnDates(), 0);
        this.createHalfSeason(this.springDates(), 1);
    }
}

const generator = new Generator();

export const generatedTeams : Team[] = generator.teams;
export const generatedMatches : Match[] = generator.matches;