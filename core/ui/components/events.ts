import blessed, { Widgets } from "blessed";
import { HLTV } from "../../features/hltv.js";
import { Event, ScoreData } from "../../types/hltv.js";
import { arrayBuffer } from "stream/consumers";
import { matchesScreen } from "./matches.js";
import { mainScreen, hltv } from "../main.js";
import { eventMenuScreen } from "./eventMenu.js";
import { showDebugBox } from "../util/testing/showDebugBox.js";

export async function eventsScreen() {
  const events = await hltv.fetchEvents();

  const list = blessed.list({
    items: events
      .sort((a, b) => {
        // what stupid shit does js think
        return Number(b.ongoing) - Number(a.ongoing);
      })
      .map((e) => {
        return `${e.ongoing ? "(Live) " : ""}${e.display}`;
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

  list.addItem("All Matches");

  list.addListener("select", async (e: Widgets.ListElement, index: number) => {
    await eventMenuScreen(events[index]);
  });

  return list;
}
