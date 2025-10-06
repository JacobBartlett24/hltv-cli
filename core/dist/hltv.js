"use strict";
// import blessed from 'blessed';
// import { HLTV } from "../features/main.js"
// const hltv = new HLTV();
// async function initScreen(){
//     const screen = blessed.screen({
//       smartCSR: true,
//     });
//     const events = await hltv.fetchHltvEvents();
//     const list = blessed.list({
//         items: events.map(e => e.display),
//         mouse: true,
//         tags: true,
//         border: {
//             type: 'line'
//         },
//         style: {
//             border: {
//                 fg: '#f0f0f0'
//             }
//         }
//     })
//     list.addListener("select", (e) => {
//         console.log(e)
//     })
//     screen.append(list);
//     screen.render();
// }
// initScreen()
