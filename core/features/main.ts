import { JSDOM } from "jsdom";

type Event = {
    display: string,
    href: string
}

type Match = {
    team1: string,
    team2: string
}

export class HLTV {

    baseUrl: string = "https://www.hltv.org";

    constructor() {
        // no super() needed unless extending a class
    }

    async fetchHltvEvents(): Promise<Event[]> {
        const response = await fetch(`${this.baseUrl}/events#tab-TODAY`);
        const text = await response.text();
        const dom = new JSDOM(text);
        
        const events: HTMLAnchorElement[] = Array.from(dom.window.document.querySelectorAll(".ongoing-event"))
            .filter((element): element is HTMLAnchorElement => element instanceof dom.window.HTMLAnchorElement);
        
        return events.map(event => {
            return {
                href: event.href,
                display: event.querySelector(".event-name-small")?.textContent.trim()
            } as Event
        });
    }

    async getEvent(endpoint: string){
        const response = await fetch(`${this.baseUrl}${endpoint}`);
        const text = await response.text();
        const dom = new JSDOM(text)

        const matches = Array.from(dom.window.document.querySelectorAll("slot-wrapper"))

        return matches.map(match => {
            return {

            } as Match
        })
    }
}