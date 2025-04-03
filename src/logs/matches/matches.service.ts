import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Kill } from '../schemas/kill.schema';
import { Match } from '../schemas/match.schema';
import { MatchRankingService } from '../matches-ranking/matches-ranking.service';
import { MatchRankingDto } from '../dtos/match-ranking.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Kill.name) private killModel: Model<Kill>,
    @InjectModel(Match.name) private matchModel: Model<Match>,
    private readonly matchRankingService: MatchRankingService,
  ) {}

  async getMatchRanking(
    matchId: string,
  ): Promise<MatchRankingDto | { message: string }> {
    const match = await this.matchModel.findOne({ matchId }).lean();
    if (!match) return { message: 'Match not found' };

    const kills = await this.killModel.find({ matchId }).lean();
    const rankingData = this.matchRankingService.calculate(kills);

    return {
      matchId,
      ...rankingData,
    };
  }

  async getAllRankings(): Promise<MatchRankingDto[]> {
    const matches = await this.matchModel.find().lean();
    const allRankings = [];

    for (const match of matches) {
      const kills = await this.killModel
        .find({ matchId: match.matchId })
        .lean();
      const rankingData = this.matchRankingService.calculate(kills);

      allRankings.push({
        matchId: match.matchId,
        ...rankingData,
      });
    }

    return allRankings;
  }
}
