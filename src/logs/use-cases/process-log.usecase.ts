import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Match } from '../schemas/match.schema';
import { Player } from '../schemas/player.schema';
import { Kill } from '../schemas/kill.schema';
import { parseLog } from '../parser/log-parser';

@Injectable()
export class ProcessLogUseCase {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
    @InjectModel(Player.name) private playerModel: Model<Player>,
    @InjectModel(Kill.name) private killModel: Model<Kill>,
  ) {}

  async execute(logContent: string) {
    const matches = parseLog(logContent);

    for (const match of matches) {
      const playersSet = new Set<string>();
      const matchDoc = new this.matchModel({
        matchId: match.matchId,
        startTime: match.startTime,
        endTime: match.endTime,
        players: [],
      });

      await matchDoc.save();

      for (const kill of match.kills) {
        const { killer, victim, weapon, timestamp } = kill;

        if (killer !== '<WORLD>') {
          playersSet.add(killer);
          await this.playerModel.updateOne(
            { name: killer },
            { $inc: { frags: 1 } },
            { upsert: true },
          );
        }

        playersSet.add(victim);
        await this.playerModel.updateOne(
          { name: victim },
          { $inc: { deaths: 1 } },
          { upsert: true },
        );

        await this.killModel.create({
          killer,
          victim,
          weapon,
          timestamp,
          matchId: match.matchId,
        });
      }

      if (playersSet.size > 20) {
        throw new Error(
          `A partida ${match.matchId} possui mais de 20 jogadores e não é permitida.`,
        );
      }

      await this.matchModel.updateOne(
        { matchId: match.matchId },
        { $set: { players: Array.from(playersSet) } },
      );
    }
  }
}
