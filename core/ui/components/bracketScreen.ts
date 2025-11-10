import blessed, { Widgets } from "blessed";
import { Event } from "../../types/hltv.js";
import { mainScreen } from "../main.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

export async function bracketScreen(event: Event) {
  const response = await fetch(
    "https://www.hltv.org/events/8779/esl-challenger-league-season-50-south-america-cup-4"
  );

  const eventDisplay = blessed.box({
    width: "100%",
    height: "100%",
    content: await response.text(),
    border: {
      type: "line",
    },
  });

  mainScreen.append(eventDisplay);

  mainScreen.render();
}
