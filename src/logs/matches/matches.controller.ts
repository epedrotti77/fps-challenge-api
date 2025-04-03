import { Controller, Get, Param } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get(':id/ranking')
  async getMatchRanking(@Param('id') matchId: string) {
    return this.matchesService.getMatchRanking(matchId);
  }
}
