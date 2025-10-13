import { JSDOM } from "jsdom";
import io from "socket.io-client";
export class HLTV {
    constructor() {
        this.baseUrl = "https://www.hltv.org";
        this.webSocketUrl = "https://scorebot-lb.hltv.org";
        this.startWebsocket();
    }
    async fetchEvents() {
        const response = await fetch(`${this.baseUrl}/events#tab-TODAY`);
        const text = await response.text();
        const dom = new JSDOM(text);
        const events = Array.from(dom.window.document.querySelectorAll(".ongoing-event")).filter((element) => element instanceof dom.window.HTMLAnchorElement);
        const uniqueEvents = Array.from(new Map(events.map((e) => [e.href, e])).values());
        return uniqueEvents
            .map((event) => {
            return {
                href: event.href.split("/")[3],
                display: event.querySelector(".event-name-small")?.textContent.trim(),
            };
        })
            .sort((a, b) => a.display.localeCompare(b.display));
    }
    async fetchTournamentMatchData() {
        const response = await fetch(`${this.baseUrl}`);
        const text = await response.text();
        const dom = new JSDOM(text);
        const matches = Array.from(dom.window.document.querySelectorAll(".teambox"));
        return matches.map((match) => {
            const hrefSplit = match.parentElement?.getAttribute("href")?.split("/");
            const eventSlug = hrefSplit ? hrefSplit[3] : "";
            return {
                team1: match.querySelectorAll(".team")[0]?.textContent,
                team2: match.querySelectorAll(".team")[1]?.textContent,
                eventSlug: eventSlug,
                eventDescription: hrefSplit ? hrefSplit[2] : "",
                isLive: match.parentElement?.getAttribute("data-livescore-match") !== null,
                id: match.parentElement?.getAttribute("data-livescore-match"),
            };
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
        socket.on("connect", async () => { });
    }
}
