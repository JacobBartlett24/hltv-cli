import blessed, { Widgets } from "blessed";
import { HLTV } from "../features/hltv.js";
import { Event, ScoreData } from "../types/hltv.js";
import { eventsScreen } from "./components/events.js";
import { startingTitle } from "./components/startingTitle.js";

const hltv = new HLTV();
let screen: Widgets.Screen;

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
