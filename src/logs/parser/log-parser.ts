export function parseLog(content: string) {
  const lines = content.split('\n').filter(Boolean);

  const matches = [];
  let currentMatch = null;

  for (const line of lines) {
    if (line.includes('New match')) {
      const matchId = line.match(/New match (\d+)/)?.[1];
      currentMatch = {
        id: matchId,
        events: [],
      };
    } else if (line.includes('has ended')) {
      matches.push(currentMatch);
      currentMatch = null;
    } else if (currentMatch) {
      currentMatch.events.push(line);
    }
  }

  return matches;
}
