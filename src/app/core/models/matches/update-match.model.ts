import { ICreateMatch, PlayerStats, Result } from "./create-match .model";

export interface IUpdateMatch extends ICreateMatch{

}



export interface ResultMatchUpdate extends Result{
}

export interface PlayerStatsUpdate extends PlayerStats{
}