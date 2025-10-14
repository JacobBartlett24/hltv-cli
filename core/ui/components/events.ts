import blessed, { Widgets } from "blessed";
import { HLTV } from "../../features/main.js";
import { Event, ScoreData } from "../../types/hltv.js";
import { arrayBuffer } from "stream/consumers";
import { matchesScreen } from "./matches.js";

export async function eventsScreen(screen: Widgets.Screen, hltv: HLTV) {
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
    await matchesScreen(events, index, list, screen, hltv);
  });

  return list;
}
