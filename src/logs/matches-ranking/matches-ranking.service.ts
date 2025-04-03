import { Injectable } from '@nestjs/common';
import { Kill } from '../schemas/kill.schema';
import { BestStreakDto, MatchRankingDto } from '../dtos/match-ranking.dto';

@Injectable()
export class MatchRankingService {
  calculate(kills: Kill[]): Omit<MatchRankingDto, 'matchId'> {
    const playerStats = this.computePlayerStats(kills);
    const ranking = this.buildRanking(playerStats);
    const topPlayer = ranking[0]?.player ?? null;

    return {
      ranking,
      topPlayer,
      preferredWeapon: topPlayer
        ? this.calculatePreferredWeapon(kills, topPlayer)
        : null,
      bestStreak: this.calculateBestStreak(kills),
      noDeathsAward: this.getNoDeathsAward(topPlayer, playerStats),
      fiveKillsAward: this.checkFiveKillsOneMinute(kills),
    };
  }

  private computePlayerStats(
    kills: Kill[],
  ): Record<string, { frags: number; deaths: number }> {
    const stats: Record<string, { frags: number; deaths: number }> = {};

    for (const { killer, victim } of kills) {
      if (killer !== '<WORLD>') {
        stats[killer] = stats[killer] || { frags: 0, deaths: 0 };
        stats[killer].frags++;
      }

      stats[victim] = stats[victim] || { frags: 0, deaths: 0 };
      stats[victim].deaths++;
    }

    return stats;
  }

  private buildRanking(
    stats: Record<string, { frags: number; deaths: number }>,
  ) {
    return Object.entries(stats)
      .map(([player, { frags, deaths }]) => ({ player, frags, deaths }))
      .sort((a, b) => b.frags - a.frags);
  }

  private getNoDeathsAward(
    topPlayer: string | null,
    stats: Record<string, { frags: number; deaths: number }>,
  ): string[] {
    if (topPlayer && stats[topPlayer]?.deaths === 0) {
      return [topPlayer];
    }
    return [];
  }

  private calculatePreferredWeapon(
    kills: Kill[],
    player: string,
  ): string | null {
    const weaponCount = this.countWeaponsUsedByPlayer(kills, player);
    return this.getMostUsedWeapon(weaponCount);
  }

  private countWeaponsUsedByPlayer(
    kills: Kill[],
    player: string,
  ): Record<string, number> {
    return kills.reduce(
      (acc, { killer, weapon }) => {
        if (killer !== player) return acc;

        acc[weapon] = (acc[weapon] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private getMostUsedWeapon(
    weaponCount: Record<string, number>,
  ): string | null {
    const sorted = Object.entries(weaponCount).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? null;
  }

  private calculateBestStreak(kills: Kill[]): BestStreakDto {
    const streaks: Record<string, number> = {};
    let maxStreak = 0;
    let playerWithMaxStreak: string | null = null;

    for (const kill of kills) {
      this.incrementStreak(kill.killer, streaks);
      this.resetStreak(kill.victim, streaks);

      const currentStreak = streaks[kill.killer] || 0;
      if (kill.killer !== '<WORLD>' && currentStreak > maxStreak) {
        maxStreak = currentStreak;
        playerWithMaxStreak = kill.killer;
      }
    }

    return { player: playerWithMaxStreak, count: maxStreak };
  }

  private incrementStreak(player: string, streaks: Record<string, number>) {
    if (player === '<WORLD>') return;
    streaks[player] = (streaks[player] || 0) + 1;
  }

  private resetStreak(player: string, streaks: Record<string, number>) {
    streaks[player] = 0;
  }

  private checkFiveKillsOneMinute(kills: Kill[]): string[] {
    const killsByPlayer = this.groupKillsByPlayer(kills);
    const awardWinners: string[] = [];

    for (const [player, timestamps] of Object.entries(killsByPlayer)) {
      if (this.hasFiveKillsInOneMinute(timestamps)) {
        awardWinners.push(player);
      }
    }

    return awardWinners;
  }

  private groupKillsByPlayer(kills: Kill[]): Record<string, Date[]> {
    return kills.reduce(
      (acc, { killer, timestamp }) => {
        if (killer === '<WORLD>') return acc;

        if (!acc[killer]) acc[killer] = [];
        acc[killer].push(new Date(timestamp));
        return acc;
      },
      {} as Record<string, Date[]>,
    );
  }

  private hasFiveKillsInOneMinute(timestamps: Date[]): boolean {
    const sorted = timestamps.sort((a, b) => a.getTime() - b.getTime());

    for (let i = 0; i <= sorted.length - 5; i++) {
      const start = sorted[i];
      const end = sorted[i + 4];

      if (end.getTime() - start.getTime() <= 60_000) {
        return true;
      }
    }

    return false;
  }
}
