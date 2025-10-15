import blessed, { loading, Widgets } from "blessed";
import { HLTV } from "../../features/main";
import { ScoreData, Event } from "../../types/hltv";
import { match } from "assert";

export async function matchesScreen(
  events: Event[],
  index: number,
  list: Widgets.ListElement,
  screen: Widgets.Screen,
  hltv: HLTV
) {
  const loadingScreen = blessed.loading({});
  screen.remove(list);
  screen.append(loadingScreen);
  screen.render();
  loadingScreen.load("Waiting for scorebot to connect...");

  const matches = await hltv.fetchTournamentMatchData();

  const eventData = {
    token: "", // Assuming token is required but empty in this case
    listIds: matches
      .filter(
        (match) =>
          (events.length !== 0
            ? match.eventSlug.includes(events[index].href)
            : true) && match !== null
      )
      .map((match) => match.id),
  };

  while (!hltv.socket?.connected) {
    await sleep(2000);
  }

  loadingScreen.stop();
  loadingScreen.load("Sending socket emit event...");

  // Emitting the 'readyForScores' event with the data
  if (hltv.socket !== null && hltv.socket !== undefined) {
    const matchLayout = blessed.layout({
      layout: "grid",
      height: "100%",
      width: "100%",
    });

    let isSendingScores: boolean = false;

    setInterval(() => {
      hltv.socket?.emit("readyForScores", JSON.stringify(eventData));
    }, 5000);

    hltv.socket.on("score", (scoreData: ScoreData) => {
      isSendingScores = true;
      loadingScreen.stop();
      addUpdateMatches(scoreData, matchLayout);
    });
  }

  loadingScreen.stop();
}

function addUpdateMatches(
  scoreData: ScoreData,
  matchLayout: Widgets.LayoutElement
) {
  matchLayout.append(
    blessed.box({
      width: "50%",
      height: "10%",
      border: {
        type: "line",
      },
    })
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
