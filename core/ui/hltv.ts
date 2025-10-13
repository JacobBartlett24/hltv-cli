import blessed, { Widgets } from "blessed";
import { HLTV } from "../features/main.js";
import { Event, ScoreData } from "../types/hltv.js";
import { arrayBuffer } from "stream/consumers";

const hltv = new HLTV();
let screen: Widgets.Screen;

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

async function startEventsScreen(screen: Widgets.Screen) {
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

  list.addListener("select", async (e: Widgets.ListElement, index: number) => {
    await startEventMatchesScreen(events, index, list);
  });
  return list;
}

async function startEventMatchesScreen(
  events: Event[],
  index: number,
  list: Widgets.ListElement
) {
  const loadingScreen = blessed.loading({
    bg: "#F8F8",
  });
  screen.remove(list);
  screen.append(loadingScreen);
  screen.render();
  loadingScreen.load("Initializing matches...");

  const matches = await hltv.fetchTournamentMatchData();

  const eventData = {
    token: "", // Assuming token is required but empty in this case
    listIds: matches
      .filter(
        (match) =>
          match.eventSlug.includes(events[index].href) && match !== null
      )
      .map((match) => match.id),
  };

  // Emitting the 'readyForScores' event with the data
  if (hltv.socket !== null && hltv.socket !== undefined) {
    hltv.socket.emit("readyForScores", JSON.stringify(eventData));

    hltv.socket.on("score", (scoreData: ScoreData) => {
      addUpdateMatches(scoreData);
    });
  }

  loadingScreen.stop();
}

function addUpdateMatches(scoreData: ScoreData) {
  const [eventName, data] = scoreData;

  for (const [mapId, mapInfo] of Object.entries(data.mapScores)) {
    console.log(mapInfo);
  }
}

initScreen();
