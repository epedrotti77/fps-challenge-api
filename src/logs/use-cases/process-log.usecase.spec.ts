import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProcessLogUseCase } from './process-log.usecase';
import { Match } from '../schemas/match.schema';
import { Player } from '../schemas/player.schema';
import { Kill } from '../schemas/kill.schema';
import { LogParserService } from '../parser/log-parser';

const sampleLog = `
23/04/2019 15:34:22 - New match 123 has started
23/04/2019 15:36:04 - Roman killed Nick using M16
23/04/2019 15:39:22 - Match 123 has ended
`;

describe('ProcessLogUseCase', () => {
  let useCase: ProcessLogUseCase;
  let matchModel: any;
  let playerModel: any;
  let killModel: any;

  beforeEach(async () => {
    matchModel = { create: jest.fn() };
    playerModel = { updateOne: jest.fn() };
    killModel = { create: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessLogUseCase,
        { provide: getModelToken(Match.name), useValue: matchModel },
        { provide: getModelToken(Player.name), useValue: playerModel },
        { provide: getModelToken(Kill.name), useValue: killModel },
        {
          provide: LogParserService,
          useValue: {
            parse: jest.fn().mockReturnValue([
              {
                matchId: '123',
                startTime: new Date(),
                endTime: new Date(),
                kills: [
                  {
                    killer: 'Roman',
                    victim: 'Nick',
                    weapon: 'M16',
                    timestamp: new Date(),
                  },
                ],
              },
            ]),
          },
        },
      ],
    }).compile();

    useCase = module.get<ProcessLogUseCase>(ProcessLogUseCase);
  });

  it('should process log and store data', async () => {
    await useCase.execute(sampleLog);
    expect(matchModel.create).toHaveBeenCalled();
    expect(playerModel.updateOne).toHaveBeenCalledTimes(2);
    expect(killModel.create).toHaveBeenCalled();
  });
});
