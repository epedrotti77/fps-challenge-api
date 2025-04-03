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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: Player.name, schema: PlayerSchema },
      { name: Kill.name, schema: KillSchema },
    ]),
  ],
  controllers: [LogsController, MatchesController],
  providers: [LogsService, ProcessLogUseCase, MatchesService],
})
export class LogsModule {}
