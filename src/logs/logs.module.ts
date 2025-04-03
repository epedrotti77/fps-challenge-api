import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { Match, MatchSchema } from './schemas/match.schema';
import { Player, PlayerSchema } from './schemas/player.schema';
import { Kill, KillSchema } from './schemas/kill.schema';
import { ProcessLogUseCase } from './use-cases/process-log.usecase';
import { MatchesController } from './matches/matches.controller';
import { MatchesService } from './matches/matches.service';
import { PlayersController } from './players/players.controller';
import { PlayersService } from './players/players.service';
import { MatchRankingService } from './matches-ranking/matches-ranking.service';
import { LogParserService } from './parser/log-parser';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: Player.name, schema: PlayerSchema },
      { name: Kill.name, schema: KillSchema },
    ]),
  ],
  controllers: [LogsController, MatchesController, PlayersController],
  providers: [LogsService, ProcessLogUseCase, MatchesService, PlayersService, MatchRankingService, LogParserService],
})
export class LogsModule {}
