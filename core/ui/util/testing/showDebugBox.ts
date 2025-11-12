import blessed, { Widgets } from "blessed";
import { mainScreen } from "../../main.js";
export function showDebugBox(text: string) {
  mainScreen.render();

  const debugBox = blessed.box({
    width: "100%",
    height: "100%",
    content: text,
    border: {
      type: "line",
    },
  });

  mainScreen.append(debugBox);
  mainScreen.render();
}
