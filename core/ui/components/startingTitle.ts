import blessed, { Widgets } from "blessed";
import { fileURLToPath } from "url";
import path from "path";

export async function startingTitle(screen: Widgets.Screen) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const imageWidget: Widgets.Node = (blessed as any).image({
    parent: screen,
    file: path.join(__dirname, "test.gif"),
    type: "ansi", // or "overlay" if you have w3mimgdisplay
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  });

  screen.append(imageWidget);

  await sleep(2000);

  screen.remove(imageWidget);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
