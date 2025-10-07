import blessed from "blessed";
import { HLTV } from "../features/main.js";

const hltv = new HLTV();

async function initScreen() {
  // const screen = blessed.screen({
  //   smartCSR: true,
  // });

  const matches = hltv.startWebsocket()
  // const list = blessed.list({
  //     items: events.map(e => {
  //         return e.display
  //     }),
  //     mouse: true,
  //     tags: true,
  //     border: {
  //         type: 'line'
  //     },
  //     style: {
  //         border: {
  //             fg: '#f0f0f0'
  //         }
  //     }
  // })

  // list.addListener("select", (e, index) => {
  //     hltv.getEvent(events[index].href)
  // })

  // screen.append(list);
  // screen.render();
}

initScreen();
