export interface PlayerStatsDto {
    player: string;
    frags: number;
    deaths: number;
  }
  
  export interface BestStreakDto {
    player: string | null;
    count: number;
  }
  
  export interface MatchRankingDto {
    matchId: string;
    ranking: PlayerStatsDto[];
    topPlayer: string | null;
    preferredWeapon: string | null;
    bestStreak: BestStreakDto;
    noDeathsAward: string[];
    fiveKillsAward: string[];
  }
  