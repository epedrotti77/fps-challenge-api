import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MatchData } from '../dtos/match.dto';

@Injectable()
export class LogParserService {
  parse(content: string): MatchData[] {
    const lines = content.split('\n').filter(Boolean);
    const matches: MatchData[] = [];

    let currentMatch: MatchData | null = null;

    for (const line of lines) {
      const parsed = this.parseLine(line);
      if (!parsed) continue;

      const { timestamp, message } = parsed;

      if (this.isMatchStart(message)) {
        currentMatch = {
          matchId: this.extractMatchId(message),
          startTime: timestamp,
          kills: [],
        };
      } else if (this.isMatchEnd(message)) {
        if (currentMatch) {
          currentMatch.endTime = timestamp;
          matches.push(currentMatch);
          currentMatch = null;
        }
      } else if (currentMatch && this.isKillEvent(message)) {
        const kill = this.parseKill(message, timestamp);
        if (kill) currentMatch.kills.push(kill);
      }
    }

    return matches;
  }

  private parseLine(line: string) {
    const parts = line.split(' - ');
    if (parts.length < 2) return null;

    const dateTimeStr = parts[0];
    const message = parts[1];
    const timestamp = new Date(
      dateTimeStr.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'),
    );

    return { timestamp, message };
  }

  private isMatchStart(msg: string) {
    return msg.includes('New match');
  }

  private isMatchEnd(msg: string) {
    return msg.includes('has ended');
  }

  private isKillEvent(msg: string) {
    return msg.includes('killed');
  }

  private extractMatchId(msg: string) {
    return msg.match(/New match (\d+)/)?.[1] || uuidv4();
  }

  private parseKill(message: string, timestamp: Date) {
    const killRegex = /^(.+?)(\[(.+?)\])? killed (.+?)(\[(.+?)\])? using (.+)$/;
    const worldRegex = /^<WORLD> killed (.+?) by (.+)$/;

    if (killRegex.test(message)) {
      const match = message.match(killRegex);
      if (!match) return null;

      const [, killer, , killerTeam, victim, , victimTeam, weapon] = match;
      if (!killer || !victim) return null;

      return { killer, victim, weapon, timestamp, killerTeam, victimTeam };
    }

    if (worldRegex.test(message)) {
      const match = message.match(worldRegex);
      if (!match) return null;

      const [, victim, weapon] = match;
      return { killer: '<WORLD>', victim, weapon, timestamp };
    }

    return null;
  }
}
