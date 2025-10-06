"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blessed_1 = require("blessed");
var screen = blessed_1.default.screen({
    smartCSR: true,
});
var box = blessed_1.default.box({
    top: 'center',
    left: 'center',
    width: '50%',
    height: '50%',
    content: 'Hello {bold}world{/bold}!',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: '#f0f0f0'
        }
    }
});
screen.append(box);
screen.render();
