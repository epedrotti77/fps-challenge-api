import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Kill } from '../schemas/kill.schema';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(@InjectModel(Kill.name) private killModel: Model<Kill>) {}

  async getGlobalRanking() {
    const kills = await this.killModel.find().lean();

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

    return Object.entries(stats)
      .map(([player, data]) => ({
        player,
        ...data,
      }))
      .sort((a, b) => b.frags - a.frags);
  }
}
