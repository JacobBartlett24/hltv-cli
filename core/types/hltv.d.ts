export type Event = {
  display: string;
  href: string;
  ongoing: boolean;
};

export type Match = {
  team1: Team;
  team2: Team;
  isLive: boolean;
  score: string;
  id: string;
  eventDescription: string;
  eventSlug: string;
};

export type Team = {
  id: string,
  name: string
}

export type ScoreData = {
  mapScores: {
    [mapId: string]: {
      firstHalf: {
        ctTeamDbId: number;
        ctScore: number;
        tTeamDbId: number;
        tScore: number;
      };
      secondHalf: {
        ctTeamDbId: number;
        ctScore: number;
        tTeamDbId: number;
        tScore: number;
      };
      overtime: {
        ctTeamDbId: number;
        ctScore: number;
        tTeamDbId: number;
        tScore: number;
      };
      mapOrdinal: number;
      scores: {
        [teamDbId: string]: number;
      };
      currentCtId: number;
      currentTId: number;
      defaultWin: boolean;
      map: string;
      mapOver: boolean;
    };
  };
  listId: number;
  wins: {
    [teamDbId: string]: number;
  };
  liveLog: {
    [key: string]: boolean;
  };
  forcedLive: boolean;
  forcedDead: boolean;
};

export interface MapScore {
  firstHalf: HalfScore;
  secondHalf: HalfScore;
  overtime: HalfScore;
  mapOrdinal: number;
  scores: Record<string, number>; // teamDbId → score
  currentCtId: number;
  currentTId: number;
  defaultWin: boolean;
  map: string;
  mapOver: boolean;
}

export interface HalfScore {
  ctTeamDbId: number;
  ctScore: number;
  tTeamDbId: number;
  tScore: number;
}
