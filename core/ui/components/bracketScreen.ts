import blessed, { Widgets } from "blessed";
import { Event } from "../../types/hltv.js";
import { mainScreen } from "../main.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

export function bracketScreen(event: Event) {
  mainScreen.render();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  blessed.box({
    width: 4,
    height: 4,
    border: {
      type: "line",
    },
  });

  const imageWidget: Widgets.Node = (blessed as any).image({
    parent: mainScreen,
    file: path.join(__dirname, "./media/bRk2sh_tSTO6fq1GLhgcal_real.png"),
    type: "ansi", // or "overlay" if you have w3mimgdisplay
    top: 0,
    left: 0,
    width: 3,
    height: 3,
  });

  mainScreen.append(imageWidget);
  mainScreen.render();
}
