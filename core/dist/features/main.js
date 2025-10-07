import { JSDOM } from "jsdom";
import io from "socket.io-client";
export class HLTV {
    constructor() {
        this.baseUrl = "https://www.hltv.org";
        this.webSocketUrl = "https://scorebot-lb.hltv.org";
    }
    async fetchHltvEvents() {
        const response = await fetch(`${this.baseUrl}/events#tab-TODAY`);
        const text = await response.text();
        const dom = new JSDOM(text);
        const events = Array.from(dom.window.document.querySelectorAll(".ongoing-event")).filter((element) => element instanceof dom.window.HTMLAnchorElement);
        const uniqueEvents = Array.from(new Map(events.map((e) => [e.href, e])).values());
        return uniqueEvents
            .map((event) => {
            return {
                href: event.href,
                display: event.querySelector(".event-name-small")?.textContent.trim(),
            };
        })
            .sort((a, b) => a.display.localeCompare(b.display));
    }
    async fetchMatches() {
        const response = await fetch(`${this.baseUrl}`);
        const text = await response.text();
        const dom = new JSDOM(text);
        const matches = Array.from(dom.window.document.querySelectorAll(".teambox"));
        // await this.startWebsocket(
        //   matches.map((match) => {
        //     return match.getAttribute("team1") ?? "";
        //   })
        // );
        console.log("done connecting to websocket...");
        return matches.map((match) => {
            const team1Id = match.getAttribute("team1");
            const team2Id = match.getAttribute("team2");
            const teams = match.querySelector(`[data-livescore-team="${team1Id}"]`);
            // const matchId = match.getAttribute("data-livescore-match")
            return {
                team1: match.querySelectorAll(".team")[0]?.textContent,
                team2: match.querySelectorAll(".team")[1]?.textContent,
                isLive: match.parentElement?.getAttribute("data-livescore-match") !== null,
                matchId: match.parentElement?.getAttribute("data-livescore-match")
            };
        });
    }
    async startWebsocket() {
        const socket = io(this.webSocketUrl, {
            upgrade: true,
            timestampParam: "t",
            transports: ["polling", "websocket"], // poll first, then upgrade
        });
        const matches = await (await this.fetchMatches()).filter(match => match.matchId !== null);
        socket.on("connect", async () => {
            const eventData = {
                token: "", // Assuming token is required but empty in this case
                listIds: matches.filter(match => match.matchId !== null)?.map((match) => match.matchId),
            };
            // Emitting the 'readyForScores' event with the data
            socket.emit("readyForScores", JSON.stringify(eventData));
            socket.on("score", (data) => {
                console.log(data.listId);
                console.log("received score");
            });
        });
    }
}
