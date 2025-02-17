// import PLAYER_DATA from "./player_data.json" with { type: "json" };

function convertRankNo(rank) {
    const numberMap = { "I": 1, "II": 2, "III": 3};
    const parts = rank.split(" ");
    const rank_title = parts[0];
    const notation = parts.pop(); 
    // Convert if it's a valid Roman numeral, otherwise keep as is
    const number = numberMap[notation] || notation;

    return `${rank_title} ${number} ${rank_title}Rank`;
}


function findMatchesInSession(matches, input_test = null) {
    let now = new Date(); // Current time in UTC
    if (input_test) { // for testing
        now = new Date(input_test * 1000)
    }

    const currentHourUTC = now.getUTCHours();
    let startSessionUTC;
    const endSessionUTC = now.getTime() / 1000
    
    if ((currentHourUTC >= 0 && currentHourUTC < 14)) { // Between 12 AM and 9 AM EST (5 AM UTC)
      const previousDay = new Date(now.getTime());
      previousDay.setUTCHours(14, 0, 0, 0); // 2 PM UTC (9 AM EST)
      previousDay.setUTCDate(previousDay.getUTCDate() - 1); // Go to previous day
      startSessionUTC = previousDay.getTime() / 1000;

  
    } else { // 9 AM EST or later
      const startOfDayUTC = new Date(now.getTime());
      startOfDayUTC.setUTCHours(14, 0, 0, 0); // 2 PM UTC (9 AM EST)
      startSessionUTC = startOfDayUTC.getTime() / 1000;
    }
    
    // console.log(`Start Session (UTC): ${startSessionUTC}`);
    // console.log(`End Session (UTC): ${endSessionUTC}`);
  
    const matchesInWindow = matches.filter(match => match.match_time_stamp >= startSessionUTC && match.match_time_stamp < endSessionUTC && match.game_mode_id == 2);
  
    return matchesInWindow;
  }

function calculateWinLoss(player_data) {
    const matches = findMatchesInSession(player_data.match_history);
    // const matches = PLAYER_DATA.match_history.filter(match => match.game_mode_id == 2);
    if (!Array.isArray(matches) || !matches.length) {
        return "No matches recorded yet. Start winning son!"
    }
    else {
        var wins, losses, netrr;
        wins = losses = netrr = 0;
        for (const match of matches) {
            if(match.player_performance.is_win.is_win) {
                wins += 1;
            }
            else {
                losses += 1;
            }
            netrr += match.player_performance.score_change
        }
        const sign = netrr > 0 ? '+' : '-';
        return `${wins}W-${losses}L\xa0\xa0\xa0${sign}${Math.abs(Math.floor(netrr))} rr`
    }
}

export {convertRankNo, calculateWinLoss};