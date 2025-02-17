const { convertRankNo, calculateWinLoss } = require("../helper_funcs.js");
const express = require("express");
const axios =  require("axios");
const port = 8080;


const app = express();

const RIVALS_API_ENDPOINT = "https://marvelrivalsapi.com/api/v1/"
const API_TOKEN = process.env.RIVALS_API_TOKEN; 
const cache = new Map();


async function updatePlayer(username)  {
    try {
        await axios.get(`${RIVALS_API_ENDPOINT}player/${username}/update`, {headers : {'X-API-Key': API_TOKEN}});
        return true;
    }
    catch (error) {
        error_msg = `Failed to update player ${username}: ${error.message}}`, 
        console.error(error_msg);
        throw new Error(error_msg)
    }
}

async function getPlayerData(username) {
    const now = Date.now();
    const cachedData = cache.get(username);

    // Check if data is fresh (less than 5 minutes old)
    if (cachedData && now - cachedData.timestamp < 15 * 60 * 1000) {
        console.log(`Data for ${username} is fresh returning cached data`);
        return cachedData.data;
    }
    try {
        console.log(`Data for ${username} is stale refreshing now`)
        const updated = await updatePlayer(username)
        if (updated) {
    
            // Call player data endpoint
            const response = await axios.get(`${RIVALS_API_ENDPOINT}player/${username}`, {
                headers: { 
                    "x-api-key": API_TOKEN,
                    "accept" : 'application/json' 
                },
                // Going to keep season commented for now since default of 1 is set in backend api
                // params: {
                //   season: 1
                // } 
            });
            
            // Get response body
            const player_data = response.data;
            cache.set(username, {"data" : player_data, "timestamp" : now});
            console.log(`Data for ${username} has been refreshed`)
            return player_data;
        }
    }
    catch (error) {
        console.log("getPlayerData failed, returning old cached data (if available).");
        if (cachedData) {
            return cachedData
        }
        else {
            throw new Error(`Failed to get player data -> ${error.message}`)
        }
    }
    
}

app.get('/', (req,res) => res.send("Twitch Chat Bot Marvel Rivals Wrapper API"));

app.get("/rank/:username", async (req, res) => {
    const username = req.params.username;
    try {
            const player_data = await getPlayerData(username);
            const rank = convertRankNo(player_data.player.rank.rank);
            res.send(rank);
    } 
    catch (error) {
        res.send(`Failed to fetch rank for ${username}`);
        console.log(`Error fetching rank for ${username} -> ${error}`);
    }
});

app.get("/winloss/:username", async (req, res) => {
    const username = req.params.username;
    try {
            const player_data = await getPlayerData(username);
            const result = calculateWinLoss(player_data);
            res.send(result);
    } 
    catch (error) {
        res.send(`Failed to fetch win loss record for ${username}`);
        console.log(`Failed to fetch win loss record for ${username}`);
    }
});


app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;