import { Kill } from '../schemas/kill.schema';
import { MatchRankingService } from './matches-ranking.service';

describe('MatchRankingService', () => {
  let service: MatchRankingService;

  beforeEach(() => {
    service = new MatchRankingService();
  });

  const kills: Kill[] = [
    {
      killer: 'Player1',
      victim: 'Player2',
      weapon: 'AK47',
      timestamp: new Date('2024-04-03T10:00:00Z'),
      matchId: 'match1',
    } as Kill,
    {
      killer: 'Player1',
      victim: 'Player3',
      weapon: 'AK47',
      timestamp: new Date('2024-04-03T10:00:30Z'),
      matchId: 'match1',
    } as Kill,
    {
      killer: 'Player1',
      victim: 'Player4',
      weapon: 'M4A1',
      timestamp: new Date('2024-04-03T10:01:00Z'),
      matchId: 'match1',
    } as Kill,
    {
      killer: '<WORLD>',
      victim: 'Player1',
      weapon: 'DROWN',
      timestamp: new Date('2024-04-03T10:02:00Z'),
      matchId: 'match1',
    } as Kill,
  ];

  it('should calculate ranking with correct frags and deaths', () => {
    const result = service.calculate(kills);
    const player1 = result.ranking.find((p) => p.player === 'Player1');
    const player2 = result.ranking.find((p) => p.player === 'Player2');

    expect(player1).toBeDefined();
    expect(player1?.frags).toBe(3);
    expect(player1?.deaths).toBe(1);
    expect(player2?.frags).toBe(0);
    expect(player2?.deaths).toBe(1);
  });

  it('should identify the preferred weapon', () => {
    const result = service.calculate(kills);
    expect(result.preferredWeapon).toBe('AK47');
  });

  it('should detect the correct best streak', () => {
    const result = service.calculate(kills);
    expect(result.bestStreak.player).toBe('Player1');
    expect(result.bestStreak.count).toBe(3);
  });

  it('should award no death if top player has no deaths', () => {
    const filteredKills = kills.filter((k) => k.killer !== '<WORLD>');
    const result = service.calculate(filteredKills);
    expect(result.noDeathsAward).toContain('Player1');
  });

  it('should detect five kills within one minute', () => {
    const baseTime = new Date('2024-04-03T10:00:00Z');
    const extendedKills: Kill[] = Array.from({ length: 5 }).map((_, i) => ({
      killer: 'Player1',
      victim: `Enemy${i}`,
      weapon: 'Pistol',
      timestamp: new Date(baseTime.getTime() + i * 10000),
      matchId: 'match1',
    })) as Kill[];

    const result = service.calculate(extendedKills);

    expect(result.fiveKillsAward).toContain('Player1');
  });
});
