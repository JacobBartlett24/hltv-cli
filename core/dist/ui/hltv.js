import blessed from "blessed";
import { HLTV } from "../features/main.js";
const hltv = new HLTV();
async function initScreen() {
    const screen = blessed.screen({
        smartCSR: true,
    });
    screen.key(['q', 'C-c'], function (ch, key) {
        return process.exit(0);
    });
    const events = await hltv.fetchEvents();
    const list = blessed.list({
        items: events.map(e => {
            return e.display;
        }),
        mouse: true,
        tags: true,
        border: {
            type: 'line'
        },
        style: {
            border: {
                fg: '#f0f0f0'
            }
        }
    });
    list.addListener("select", async (e, index) => {
        const matches = await hltv.fetchMatchData();
        const eventData = {
            token: "", // Assuming token is required but empty in this case
            listIds: matches
                .filter(match => match.eventSlug.includes(events[index].href) && match !== null)
                .map((match) => match.id),
        };
        // Emitting the 'readyForScores' event with the data
        if (hltv.socket !== null && hltv.socket !== undefined) {
            screen.realloc();
            console.log("getting ready for score");
            hltv.socket.emit("readyForScores", JSON.stringify(eventData));
            hltv.socket.on("score", (data) => {
                console.log("score");
                console.log(data);
            });
        }
        else {
            console.log("loading....");
            screen.realloc();
            const loading = blessed.loading();
            screen.append(loading);
            screen.render();
        }
    });
    screen.append(list);
    screen.render();
}
initScreen();
