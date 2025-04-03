import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MatchesService } from './matches.service';
import { MatchRankingService } from '../matches-ranking/matches-ranking.service';
import { Kill } from '../schemas/kill.schema';
import { Match } from '../schemas/match.schema';

describe('MatchesService', () => {
  let service: MatchesService;
  let killModel: any;
  let matchModel: any;
  let rankingService: MatchRankingService;

  beforeEach(async () => {
    killModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      }),
    };

    matchModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      }),
      findOne: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(undefined),
      }),
    };

    rankingService = { calculate: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        { provide: getModelToken(Kill.name), useValue: killModel },
        { provide: getModelToken(Match.name), useValue: matchModel },
        { provide: MatchRankingService, useValue: rankingService },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  it('should return match ranking', async () => {
    const matchId = '123';
    const fakeMatch = { matchId };
    const fakeKills = [{ killer: 'Player1', victim: 'Player2' }];
    const rankingData = {
      ranking: [],
      topPlayer: null,
      preferredWeapon: null,
      bestStreak: { player: null, count: 0 },
      noDeathsAward: [],
      fiveKillsAward: [],
    };

    matchModel.findOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(fakeMatch),
    });

    killModel.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue(fakeKills),
    });

    (rankingService.calculate as jest.Mock).mockReturnValue(rankingData);

    const result = await service.getMatchRanking(matchId);

    expect(result).toEqual({ matchId, ...rankingData });
    expect(matchModel.findOne).toHaveBeenCalledWith({ matchId });
    expect(killModel.find).toHaveBeenCalledWith({ matchId });
    expect(rankingService.calculate).toHaveBeenCalledWith(fakeKills);
  });

  it('should return not found if match does not exist', async () => {
    matchModel.findOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    const result = await service.getMatchRanking('not_found');

    expect(result).toEqual({ message: 'Match not found' });
  });

  it('should return all rankings', async () => {
    const matches = [{ matchId: '1' }, { matchId: '2' }];
    const fakeKills = [{ killer: 'A', victim: 'B' }];
    const rankingData = {
      ranking: [],
      topPlayer: null,
      preferredWeapon: null,
      bestStreak: { player: null, count: 0 },
      noDeathsAward: [],
      fiveKillsAward: [],
    };

    matchModel.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue(matches),
    });

    killModel.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue(fakeKills),
    });

    (rankingService.calculate as jest.Mock).mockReturnValue(rankingData);

    const result = await service.getAllRankings();

    expect(result).toEqual([
      { matchId: '1', ...rankingData },
      { matchId: '2', ...rankingData },
    ]);
    expect(matchModel.find).toHaveBeenCalled();
    expect(killModel.find).toHaveBeenCalledTimes(2);
    expect(rankingService.calculate).toHaveBeenCalledTimes(2);
  });
});
