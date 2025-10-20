import blessed, { Widgets } from "blessed";
import { HLTV } from "../features/hltv.js";
import { Event, ScoreData } from "../types/hltv.js";
import { eventsScreen } from "./components/events.js";
import { startingTitle } from "./components/startingTitle.js";

export const hltv = new HLTV();
export let mainScreen: Widgets.Screen;

async function initScreen() {
  mainScreen = setScreenDefault();
  await startingTitle();
  const eventScreen = await eventsScreen();

  mainScreen.append(eventScreen);
  eventScreen.focus();
  mainScreen.render();
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
