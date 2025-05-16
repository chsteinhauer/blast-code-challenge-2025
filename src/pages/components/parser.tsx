
export type Attack = { 
    attacker: string, 
    attackerTeam: string, 
    victim: string, 
    victimTeam: string 
};

export type MatchRound = {
    round: string, 
    start: Date, 
    end: Date, 
    ct: string, 
    terrorist: string, 
    score: { [name: string]: number },
    kills: Attack[],
    assists: Attack[],
    
}

export type Player = { 
    name: string, 
    steamId: string, 
    team: string 
}

export type MatchData = {
    players: Player[],
    rounds: MatchRound[],
    teamA: {
        name?: string,
        finalScore?: string,
    },
    teamB: {
        name?: string,
        finalScore?: string,
    },
}


export const ParseFile = async (path: string) => {
    const data: MatchData = {
        players: [],
        rounds: [],
        teamA: {},
        teamB: {},
    };


    await fetch(path)
        .then( r => r.text())
        .then(text => {
            
            const lines = text.split("\n");

            // Regex patterns
            const playerAdded = /(\d{2}\/\d{2}\/\d{4}) - (\d{2}:\d{2}:\d{2}): "([^"<]+)<(\d+)><(STEAM_\d:\d:\d+)><>" entered the game/;
            const teamAssigned = /(\d{2}\/\d{2}\/\d{4}) - (\d{2}:\d{2}:\d{2}): "([^"<]+)<(\d+)><(STEAM_\d:\d:\d+)>" switched from team <([^>]+)> to <([^>]+)>/;
            const teamPlaying = /(\d{2}\/\d{2}\/\d{4}) - (\d{2}:\d{2}:\d{2}): MatchStatus: Team playing "(.+?)": (.+)/;
            const roundsPlayed = /(\d{2}\/\d{2}\/\d{4}) - (\d{2}:\d{2}:\d{2}): MatchStatus: Score: (\d+):(\d+) on map "(.+?)" RoundsPlayed: (\d+)/
            const currentScore = /(\d{2}\/\d{2}\/\d{4}) - (\d{2}:\d{2}:\d{2}):\s+\x04\[FACEIT\^] (.+?) \[(\d+) - (\d+)] (.+)/;
            const playerKilled = /(\d{2}\/\d{2}\/\d{4}) - (\d{2}:\d{2}:\d{2}): "(.+?)<\d+><(STEAM_\d:\d:\d+)><(.+?)>" \[(-?\d+) (-?\d+) (-?\d+)] killed "(.+?)<\d+><(STEAM_\d:\d:\d+)><(.+?)>" \[(-?\d+) (-?\d+) (-?\d+)] with "(.+?)"( \(headshot\))?/;
            const worldTrigger = /(\d{2}\/\d{2}\/\d{4}) - (\d{2}:\d{2}:\d{2}): World triggered "(.+?)"/;

            // temporary variables to contain data of a round
            let roundStartTime = null;
            let currentRound = null;
            let kills: Attack[] = [];
            let assists: Attack[] = [];
            let terrorist = null;
            let ct = null;
            let score = {};

            // Begin parsing data...
            for (const line of lines) {

                // ADD PLAYER
                if (playerAdded.test(line)) {
                    const match = line.match(playerAdded);

                    // if regex matches, and player name is not already added, then add player to dataset
                    if (match && !data.players.find(p => p.name === match[3])) {
                        data.players.push({ name: match[3], steamId: match[5], team: "Unassigned" })
                    }
                }

                // ASSIGN TEAM
                if (teamAssigned.test(line)) {
                    const match = line.match(teamAssigned);

                    if (match) {
                        const player = data.players.find(p => p.name === match[3]);

                        if (player) {
                            player.team = match[7];
                        }
                    }
                }

                // ASSIGN TEAM PLAYING IN A ROUND
                if (teamPlaying.test(line)) {
                    const match = line.match(teamPlaying);

                    if (match) {
                        switch (match[3]) {
                            case "CT":
                                ct = match[4];
                                break;
                            case "TERRORIST":
                                terrorist = match[4];
                                break;
                        
                            default:
                                break;
                        }
                    }
                }

                // ASSIGN CURRENT ROUND PLAYED
                if (roundsPlayed.test(line)) {
                    const match = line.match(roundsPlayed);

                    if (match) {
                        currentRound = match[6];
                    }
                }

                // ASSIGN CURRENT ROUND SCORE
                if (currentScore.test(line)) {
                    const match = line.match(currentScore);

                    if (match) {
                        score = { 
                            [match[3]]: match[4],
                            [match[6]]: match[5]
                        }

                        // update match data
                        data.teamA = {
                            name: match[3],
                            finalScore: match[4]
                        };

                        data.teamB = {
                            name: match[6],
                            finalScore: match[5]
                        }
                    }
                }

                // ADD PLAYER KILLED
                if (playerKilled.test(line)) {
                    const match = line.match(playerKilled);

                    if (match) {
                        kills.push({
                            attacker: match[3],
                            attackerTeam: match[5],
                            victim: match[9],
                            victimTeam: match[11]
                        });
                    }
                }

                // WORLD TRIGGERED LOGS
                if (worldTrigger.test(line)) {
                    const match = line.match(worldTrigger);

                    if (match) {

                    switch (match[3]) {
                        case "Round_Start":
                            roundStartTime = new Date(match[1] + " " + match[2]);

                            // reset kill and assist data at round start
                            kills = [];
                            assists = [];
                            break;
                        
                        case "Round_End":

                            if (roundStartTime && currentRound != null && ct && terrorist) {
                                const roundEndTime = new Date(match[1] + " " + match[2]);

                                data.rounds.push({ 
                                    round: currentRound, 
                                    start: roundStartTime, 
                                    end: roundEndTime,
                                    ct,
                                    terrorist,
                                    score,
                                    kills,
                                    assists
                                })
                            }
                            break;
                        default:
                            break;
                    }
                }
                }
            }
        });

    return data;
}
