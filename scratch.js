const PLAYER_DATA = import("./player_data.json")



function findMatchesInSession(matches, forced = null) {
    
    let now = new Date(); // Current time in UTC
    if (forced) {
        now = new Date(forced * 1000)
        console.log("Here")
    }

    const currentHourUTC = now.getUTCHours();
    console.log(currentHourUTC)
    let startSessionUTC;
    const endSessionUTC = now.getTime() / 1000
    
    if ((currentHourUTC >= 0 && currentHourUTC < 14)) { // Between 12 AM and 9 AM EST (5 AM UTC)
      const previousDay = new Date(now.getTime());
      previousDay.setUTCHours(14, 0, 0, 0); // 2 PM UTC (9 AM EST)
      previousDay.setUTCDate(previousDay.getUTCDate() - 1); // Go to previous day
      startSessionUTC = previousDay.getTime() / 1000;

  
    } else { // 9 AM EST or later
      const startOfDayUTC = new Date(now.getTime());
      console.log(startOfDayUTC)
      startOfDayUTC.setUTCHours(14, 0, 0, 0); // 2 PM UTC (9 AM EST)
      startSessionUTC = startOfDayUTC.getTime() / 1000;
    }
    
    console.log(`Start Session (UTC): ${startSessionUTC}`);
    console.log(`End Session (UTC): ${endSessionUTC}`);
  
    const matchesInWindow = matches.filter(match => match.match_time_stamp >= startSessionUTC && match.match_time_stamp < endSessionUTC && match.game_mode_id == 2);
  
    return matchesInWindow;
  }
  
  1739750400
  // Example usage (timestamps in SECONDS):
  const objects = [
    { name: "Event 1", match_time_stamp: 1739746800, game_mode_id : 2 }, // valid    6pm 2-16
    { name: "Event 2", match_time_stamp: 1739743200, game_mode_id : 2 }, // valid    5pm 2-16
    { name: "Event 3", match_time_stamp: 1739707200, game_mode_id : 2 }, // invalid  7am 2-16
    { name: "Event 4", match_time_stamp: 1739775600, game_mode_id : 2 }, // valid    2am 2-17
    { name: "Event 5", match_time_stamp: 1739718000, game_mode_id : 2 }, // valid    10am 2-16
    { name: "Event 6", match_time_stamp: 1739718000, game_mode_id : 1}, // valid    10am 2-16
  ];
  
  const input1 = 1739754000 // 16th @ 8pm est
  const specificTimeUTC = 1739779200; // 8utc 3am est
  const objectsInWindow2 = findMatchesInSession(objects, input1);
  console.log("Objects in window for specific time:", objectsInWindow2);
