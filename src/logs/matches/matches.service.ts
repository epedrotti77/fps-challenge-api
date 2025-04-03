import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Kill } from '../schemas/kill.schema';
import { Match } from '../schemas/match.schema';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Kill.name) private killModel: Model<Kill>,
    @InjectModel(Match.name) private matchModel: Model<Match>,
  ) {}

  async getMatchRanking(matchId: string) {
    const match = await this.matchModel.findOne({ matchId }).lean();
    if (!match) return { message: 'Match not found' };

    const kills = await this.killModel.find({ matchId }).lean();

    const stats: Record<string, { frags: number; deaths: number }> = {};

    for (const kill of kills) {
      const { killer, victim } = kill;

      if (killer !== '<WORLD>') {
        if (!stats[killer]) stats[killer] = { frags: 0, deaths: 0 };
        stats[killer].frags += 1;
      }

      if (!stats[victim]) stats[victim] = { frags: 0, deaths: 0 };
      stats[victim].deaths += 1;
    }

    const ranking = Object.entries(stats)
      .map(([player, data]) => ({ player, ...data }))
      .sort((a, b) => b.frags - a.frags);

    return {
      matchId,
      ranking,
    };
  }
}
