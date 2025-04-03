import { Test, TestingModule } from '@nestjs/testing';
import { LogParserService } from '../parser/log-parser';
import { MatchData } from '../dtos/match.dto';

describe('LogParserService', () => {
  let service: LogParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogParserService],
    }).compile();

    service = module.get<LogParserService>(LogParserService);
  });

  it('should parse a match log', () => {
    const log = `
    23/04/2024 15:34:22 - New match 11348965 has started
    23/04/2024 15:35:00 - Roman killed Nick using M16
    23/04/2024 15:36:30 - Match 11348965 has ended
    `;

    const result: MatchData[] = service.parse(log);

    expect(result).toHaveLength(1);
    expect(result[0].matchId).toBe('11348965');
    expect(result[0].kills).toHaveLength(1);
    expect(result[0].kills[0].killer).toBe('Roman');
    expect(result[0].kills[0].victim).toBe('Nick');
  });
});