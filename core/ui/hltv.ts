import blessed, { Widgets } from "blessed";
import { HLTV } from "../features/main.js";
import { Event, ScoreData } from "../types/hltv.js";
import { arrayBuffer } from "stream/consumers";
import { eventsScreen } from "./components/events.js";

const hltv = new HLTV();
let screen: Widgets.Screen;

async function initScreen() {
  screen = setScreenDefault();
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
