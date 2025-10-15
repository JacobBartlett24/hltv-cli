import blessed from "blessed";
import { HLTV } from "../features/main.js";
import { eventsScreen } from "./components/events.js";
const hltv = new HLTV();
let screen;
async function initScreen() {
    screen = setScreenDefault();
    // await startingTitle(screen);
    const eventScreen = await eventsScreen(screen, hltv);
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
initScreen();
