import blessed, { loading, Widgets } from "blessed";
import { HLTV } from "../../features/hltv";
import { ScoreData, Event, Match, Team } from "../../types/hltv";
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

  const eventMatches = matches.filter(
    (match) =>
      (events.length !== 0
        ? match.eventSlug.includes(events[index].href)
        : true) && match !== null
  );

  const eventData = {
    token: "", // Assuming token is required but empty in this case
    listIds: eventMatches.map((match) => match.id),
  };

  // while (!hltv.socket?.connected) {
  //   await sleep(2000);
  // }
  const matchLayout = blessed.layout({
    layout: "grid",
    height: "100%",
    width: "100%",
  });

  addUpdateMatches(null, matchLayout, eventMatches);
  screen.append(matchLayout);

  loadingScreen.stop();
  loadingScreen.load("Sending socket emit event...");

  // Emitting the 'readyForScores' event with the data
  if (hltv.socket !== null && hltv.socket !== undefined) {
    setInterval(() => {
      hltv.socket?.emit("readyForScores", JSON.stringify(eventData));
    }, 5000);

    hltv.socket.on("score", (scoreData: ScoreData) => {
      loadingScreen.stop();
      addUpdateMatches(scoreData, matchLayout, eventMatches);
      screen.append(matchLayout);
    });
  }

  loadingScreen.stop();
}

function addUpdateMatches(
  scoreData: ScoreData | null,
  matchLayout: Widgets.LayoutElement,
  eventMatches: Match[]
) {
  for (let i = 0; i < eventMatches.length; i++) {
    matchLayout.append(
      blessed.box({
        width: "50%",
        height: 4,
        border: {
          type: "line",
        },
        content: generateMatchBoxContent(scoreData, eventMatches[i]),
      })
    );
  }
}

function generateMatchBoxContent(
  scoreData: ScoreData | null,
  match: Match
): string {
  return `${generateTeamScoreLine(
    scoreData,
    match.team1
  )} \n${generateTeamScoreLine(scoreData, match.team2)}`;
}

function generateTeamScoreLine(
  scoreData: ScoreData | null,
  team: Team
): string {
  return scoreData === null
    ? `${team.name}: loading...`
    : `${team.name}: ${
        scoreData.mapScores["1"].scores[team.id] === undefined
          ? "0"
          : scoreData.mapScores["1"].scores[team.id]
      } (${scoreData.wins[team.id]})`;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
