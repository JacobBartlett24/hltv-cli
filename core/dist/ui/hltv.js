import blessed from "blessed";
import { HLTV } from "../features/main.js";
const hltv = new HLTV();
let screen;
async function initScreen() {
    screen = setScreenDefault();
    const eventScreen = await startEventsScreen(screen);
    screen.append(eventScreen);
    eventScreen.focus();
    screen.render();
}
function setScreenDefault() {
    const screen = blessed.screen({
        smartCSR: true,
    });
    screen.key(["q", "C-c"], function (ch, key) {
        return process.exit(0);
    });
    return screen;
}
async function startEventsScreen(screen) {
    const events = await hltv.fetchEvents();
    const list = blessed.list({
        items: events.map((e) => {
            return e.display;
        }),
        mouse: true,
        keys: true,
        tags: true,
        border: {
            type: "line",
        },
        style: {
            selected: {
                fg: "#D8F",
            },
            border: {
                fg: "#f0f0f0",
            },
        },
    });
    list.addListener("select", async (e, index) => {
        await startEventMatchesScreen(events, index, list);
    });
    return list;
}
async function startEventMatchesScreen(events, index, list) {
    const loadingScreen = blessed.loading({
        bg: "#F8F8",
    });
    screen.remove(list);
    screen.append(loadingScreen);
    loadingScreen.load("fetching matches...");
    screen.render();
    const matches = await hltv.fetchTournamentMatchData();
    const eventData = {
        token: "", // Assuming token is required but empty in this case
        listIds: matches
            .filter((match) => match.eventSlug.includes(events[index].href) && match !== null)
            .map((match) => match.id),
    };
    // Emitting the 'readyForScores' event with the data
    if (hltv.socket !== null && hltv.socket !== undefined) {
        hltv.socket.emit("readyForScores", JSON.stringify(eventData));
        hltv.socket.on("score", (scoreData) => {
            addUpdateMatches(scoreData);
            loadingScreen.stop();
        });
    }
}
function addUpdateMatches(scoreData) {
    const [eventName, data] = scoreData;
    for (const [mapId, mapInfo] of Object.entries(data.mapScores)) {
        console.log(mapInfo);
    }
}
initScreen();
