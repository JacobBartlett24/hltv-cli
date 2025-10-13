import blessed, { Widgets } from "blessed";
import { HLTV } from "../features/main.js";
import { Event, ScoreData } from "../types/hltv.js";
import { arrayBuffer } from "stream/consumers";

const hltv = new HLTV();

async function initScreen() {
  const screen = setScreenDefault();
  const eventScreen = await startEventsScreen(screen);

  screen.append(eventScreen);
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
    tags: true,
    border: {
      type: "line",
    },
    style: {
      border: {
        fg: "#f0f0f0",
      },
    },
  });

  list.addListener("select", async (e: Widgets.ListElement, index) => {
    await startEventMatchesScreen(events, index, screen, list);
  });
  return list;
}

async function startEventMatchesScreen(
  events: Event[],
  index: any,
  screen: Widgets.Screen,
  list: Widgets.ListElement
) {
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

  screen.remove(list);

  // Emitting the 'readyForScores' event with the data
  if (hltv.socket !== null && hltv.socket !== undefined) {
    hltv.socket.emit("readyForScores", JSON.stringify(eventData));

    hltv.socket.on("score", (scoreData: ScoreData) => {
      addUpdateMatches(screen, scoreData);
    });
  }
}

function addUpdateMatches(screen: Widgets.Screen, scoreData: ScoreData) {
  const [eventName, data] = scoreData;

  for (const [mapId, mapInfo] of Object.entries(data.mapScores)) {
    console.log(mapInfo);
  }
}

initScreen();
