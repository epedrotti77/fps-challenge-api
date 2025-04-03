export interface KillEvent {
    killer: string;
    victim: string;
    weapon?: string;
    timestamp: Date;
    killerTeam?: string;
    victimTeam?: string;
  }