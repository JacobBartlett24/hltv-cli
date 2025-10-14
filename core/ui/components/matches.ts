import blessed, { Widgets } from "blessed";
import { HLTV } from "../../features/main";
import { ScoreData, Event } from "../../types/hltv";

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
    let isSendingScores: boolean = false;

    setInterval(() => {
      hltv.socket?.emit("readyForScores", JSON.stringify(eventData));
    }, 5000);

    hltv.socket.on("score", (scoreData: ScoreData) => {
      isSendingScores = true;
      loadingScreen.stop();
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
