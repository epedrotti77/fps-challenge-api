import { KillEvent } from "./kill.dto";

export interface MatchData {
  matchId: string;
  startTime: Date;
  endTime?: Date;
  kills: KillEvent[];
}
