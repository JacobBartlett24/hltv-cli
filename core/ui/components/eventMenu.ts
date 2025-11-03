import blessed, { Widgets } from "blessed";
import { HLTV } from "../../features/hltv.js";
import { mainScreen } from "../main.js";
import { Event } from "../../types/hltv.js";
import { matchesScreen } from "./matches.js";
import { bracketScreen } from "./bracketScreen.js";

export async function eventMenuScreen(event: Event) {
  mainScreen.render();

  const menu = ["Bracket", "Live Matches"];

  const list = blessed.list({
    items: menu,
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
    if (e.content === "All Matches") {
      await matchesScreen(null);
    } else if (e.content === "Bracket") {
      await bracketScreen(event);
    } else {
      await matchesScreen(event);
    }
  });

  list.focus();

  mainScreen.append(list);
  mainScreen.render();
}
