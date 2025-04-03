import { v4 as uuidv4 } from 'uuid';

interface KillEvent {
  killer: string;
  victim: string;
  weapon?: string;
  timestamp: Date;
}

interface MatchData {
  matchId: string;
  startTime: Date;
  endTime?: Date;
  kills: KillEvent[];
}

export function parseLog(content: string): MatchData[] {
  const lines = content.split('\n').filter(Boolean);
  const matches: MatchData[] = [];

  let currentMatch: MatchData | null = null;

  for (const line of lines) {
    const parts = line.split(' - ');
    if (parts.length < 2) continue;

    const dateTimeStr = parts[0];
    const message = parts[1];
    const timestamp = new Date(
      dateTimeStr.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'),
    );

    if (message.includes('New match')) {
      const matchId = message.match(/New match (\d+)/)?.[1];
      currentMatch = {
        matchId: matchId || uuidv4(),
        startTime: timestamp,
        kills: [],
      };
    } else if (message.includes('has ended')) {
      if (currentMatch) {
        currentMatch.endTime = timestamp;
        matches.push(currentMatch);
        currentMatch = null;
      }
    } else if (currentMatch && message.includes('killed')) {
      const killRegex = /^(.+?) killed (.+?) using (.+)$/;
      const worldRegex = /^<WORLD> killed (.+?) by (.+)$/;

      if (killRegex.test(message)) {
        const [, killer, victim, weapon] = message.match(killRegex)!;
        currentMatch.kills.push({ killer, victim, weapon, timestamp });
      } else if (worldRegex.test(message)) {
        const [, victim, weapon] = message.match(worldRegex)!;
        currentMatch.kills.push({
          killer: '<WORLD>',
          victim,
          weapon,
          timestamp,
        });
      }
    }
  }

  return matches;
}
