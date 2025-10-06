import { JSDOM } from "jsdom";
export class HLTV {
    constructor() {
        this.baseUrl = "https://www.hltv.org";
        // no super() needed unless extending a class
    }
    async fetchHltvEvents() {
        const response = await fetch(`${this.baseUrl}/events#tab-TODAY`);
        const text = await response.text();
        const dom = new JSDOM(text);
        const events = Array.from(dom.window.document.querySelectorAll(".ongoing-event"))
            .filter((element) => element instanceof dom.window.HTMLAnchorElement);
        return events.map(event => {
            console.log(event.querySelector(".event-name-small")?.textContent);
            return {
                href: event.href,
                display: event.querySelector(".event-name-small")?.textContent.trim()
            };
        });
    }
}
