import { JSDOM } from "jsdom";
import { io } from "socket.io-client";

type Event = {
    display: string,
    href: string
}

type Match = {
    team1: string,
    team2: string,
    isLive: boolean,
    score: string
}

let headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Referer": "",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-User": "?1",
  "Sec-Fetch-Dest": "document",
  "Cookie": "MatchFilter={%22active%22:false%2C%22live%22:false%2C%22stars%22:1%2C%22lan%22:false%2C%22teams%22:[]}; CookieConsent={stamp:%27SaiNMkEARCi+vFNd7wtdSM0Vuzo96ZtXi442vQ3GP9nKQlYmaVlQeQ==%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cmethod:%27explicit%27%2Cver:1%2Cutc:1749652898237%2Cregion:%27us-48%27}; cf_clearance=JVJs_qD5L99c3PKs6h11uZPfrbR.vo1Jw8KDABR8N_Y-1759764976-1.2.1.1-dKzIn8_Zs8rT_rmvyMfr22mZm7xe.2DdigLUNNgjpN3rCXBFFRFQwJykGbjwATedEf6pL5d8LhqGOWGyMSsptf5XOH0ObsQ9pN73TPrN4C1HrlpME_lPwsY.hVguxe.79Tid4kg.VziCC5U.x5MwROR76B1TNt_8ZAaI1U.fwW4KoceUSxrNORpzuO2MnKl9oAg1hNF74LV_coDMW68lmbC8YjIEpk9P3a48C0BVK46iepCv8pcSM1IC7R3HDovY; nightmode=off; autologin=VeFpwcFCOaP9snSwdrOc9aYq9g7atr4q; PHPSESSID=C0D6A0BCAC20DC56CB356BAC5853A984; __cflb=0H28vvhCcx7neqKqegLg3bDFqvDd36G6w2zy8cJiM5v; __cf_bm=ZRcCQXoFLwzBztqQ7PRhNNHpJ2XIXGVkZkEnXBnOYIY-1759764962-1.0.1.1-HWZQF8zJ_26iB4fczzr4SfA6pD1glFnjtYxZy9_wYgicoJf7tjidSz6tZuuh_QeiW_Te4EIHDrAyfK3AxoPQw3WiynilKqupheN3EvOkz8A"
};

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

        const uniqueEvents = Array.from(
          new Map(events.map(e => [e.href, e])).values()
        );

        // headers.Cookie = response.headers.getSetCookie().join("; ");
        return uniqueEvents.map(event => {
            return {
                href: event.href,
                display: event.querySelector(".event-name-small")?.textContent.trim()
            } as Event
        })
        .sort((a, b) => a.display.localeCompare(b.display));
    }

    async fetchMatches(){
        await this.startWebsocket()
        const response = await fetch(`${this.baseUrl}`);

        const text = await response.text();
        const dom = new JSDOM(text);
        const matches = Array.from(dom.window.document.querySelectorAll(".teambox"))
        return matches.map(match => {
            const team1Id = match.getAttribute("team1")
            const team2Id = match.getAttribute("team2")
            const teams = match.querySelector(`[data-livescore-team="${team1Id}"]`)
            return {
                team1: match.querySelectorAll(".team")[0]?.textContent,
                team2: match.querySelectorAll(".team")[1]?.textContent,
                isLive: true
            } as Match
        })
    }

    async startWebsocket(){
        const socket = io("https://scorebot-lb.hltv.org", {
          path: "/socket.io",
          transports: ["polling", "websocket"], // allow polling then upgrade
          // Node-only: send headers (Origin/Referer/Cookie) similar to browser
          extraHeaders: {
            Origin: "https://www.hltv.org",
            Referer: "https://www.hltv.org/",
            "User-Agent": "Mozilla/5.0 (compatible)"
          },
          // you can increase timeouts for slower networks:
          timeout: 20000,
          reconnectionAttempts: 5,
        });

        
        socket.onAny((event, ...args) => {
          console.log("event:", event, "args:", args);
        });
    }
}