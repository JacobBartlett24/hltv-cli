import { JSDOM } from "jsdom";
import io from "socket.io-client";
import type {
  Event,
  Match,
  ScoreData,
  MapScore,
  HalfScore,
} from "../types/hltv";
import { compileFunction } from "vm";

export class HLTV {
  baseUrl: string = "https://www.hltv.org";
  webSocketUrl: string = "https://scorebot-lb.hltv.org";
  socket?: SocketIOClient.Socket;

  constructor() {
    this.startWebsocket();
  }

  async getTeam(): Promise<string> {
    const suffix = "asd";
    const url = `${this.baseUrl}/${suffix}`;

    const dom = await this.getPageDom(url)

    const teamName = dom
      .window
      .document
      .querySelector(".profile-team-name")?.textContent ?? 
      "no team found"

    return teamName
  }

  async fetchEvents(): Promise<Event[]> {
    const dom = await this.getPageDom(`${this.baseUrl}/events#tab-TODAY`);
    
    const matches = await this.fetchTournamentMatchData();
    const events: HTMLAnchorElement[] = Array.from(
      dom.window.document.querySelectorAll(".ongoing-event")
    ).filter(
      (element): element is HTMLAnchorElement =>
        element instanceof dom.window.HTMLAnchorElement
    );

    const uniqueEvents = Array.from(
      new Map(events.map((e) => [e.href, e])).values()
    );

    const allEvents = uniqueEvents
      .map((event) => {
        const href = event.href.split("/")[3];
        const display = event
          .querySelector(".event-name-small")
          ?.textContent.trim();

        return {
          href: href,
          display: display,
          ongoing: matches.some((m) => {
            return m.eventSlug.includes(href) && m.isLive;
          }),
        } as Event;
      })
      .sort((a, b) => a.display.localeCompare(b.display));

    return allEvents;
  }

  private async getPageDom(url: string) {
    const response = await fetch(url);

    const text = await response.text();
    const dom = new JSDOM(text);

    return dom;
  }

  async fetchTournamentMatchData() {
    const response = await fetch(`${this.baseUrl}`);

    const text = await response.text();
    const dom = new JSDOM(text);

    const matches = Array.from(
      dom.window.document.querySelectorAll(".teambox")
    );

    return matches.map((match) => {
      const hrefSplit = match.parentElement?.getAttribute("href")?.split("/");
      const eventSlug = hrefSplit ? hrefSplit[3] : "";
      return {
        team1: {
          id: match.getAttribute("team1"),
          name: match.querySelectorAll(".team")[0]?.textContent
        },
        team2: {
          id: match.getAttribute("team2"),
          name: match.querySelectorAll(".team")[1]?.textContent
        },
        eventSlug: eventSlug,
        eventDescription: hrefSplit ? hrefSplit[2] : "",
        isLive:
          match.parentElement?.getAttribute("data-livescore-match") !== null,
        id: match.parentElement?.getAttribute("data-livescore-match"),
      } as Match;
    });
  }

  async startWebsocket() {
    this.socket = io(this.webSocketUrl, {
      upgrade: true,
      timestampParam: "t",
      transports: ["polling", "websocket"], // poll first, then upgrade
      transportOptions: {
        polling: {
          extraHeaders: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            Origin: "https://www.hltv.org",
            Referer: "https://www.hltv.org/",
          },
        },
        websocket: {
          extraHeaders: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            Origin: "https://www.hltv.org",
            Referer: "https://www.hltv.org/",
          },
        },
      },
    });

    const socket = this.socket;

    socket.on("connect", async () => {});
  }
}
