import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PlayersService } from './players.service';
import { Kill } from '../schemas/kill.schema';

describe('PlayersService', () => {
  let service: PlayersService;
  let killModel: any;

  beforeEach(async () => {
    killModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          { killer: 'Player1', victim: 'Player2' },
          { killer: 'Player1', victim: 'Player3' },
          { killer: '<WORLD>', victim: 'Player1' },
        ]),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        { provide: getModelToken(Kill.name), useValue: killModel },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
  });

  it('should return global player ranking', async () => {
    const ranking = await service.getGlobalRanking();
    expect(ranking).toEqual([
      { player: 'Player1', frags: 2, deaths: 1 },
      { player: 'Player2', frags: 0, deaths: 1 },
      { player: 'Player3', frags: 0, deaths: 1 },
    ]);
  });
});
