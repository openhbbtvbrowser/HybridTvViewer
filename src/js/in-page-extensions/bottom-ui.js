// This one needs to be loaded via webpack html-loader
import * as bottomUIHtmlTemplate from "./bottom-ui-template.html"

const VK = {
    RED: 0x1, // "RED
    GREEN: 0x2, // "GREEN
    YELLOW: 0x4, // "YELLOW
    BLUE: 0x8, // "BLUE
    NAVIGATION: 0x10, // "UP, "DOWN, "LEFT, "RIGHT, "ENTER, "BACK
    VCR: 0x20, // "PLAY, "PAUSE, "STOP, "NEXT, "PREV, "FAST_FWD, "REWIND, "PLAY_PAUSE
    SCROLL: 0x40, // "PAGE_UP, "PAGE_DOWN
    INFO: 0x80, // "INFO
    NUMERIC: 0x100, // "0 ... "9
    ALPHA: 0x200, // A ... Z
    OTHER: 0x400 // OTHERS
};

export class BottomUi {

    constructor() {
        this.bottomUiDiv;
    }
    start() {
        // add container
        const body = document.getElementsByTagName("body")[0];
        body.insertAdjacentHTML("beforeend", bottomUIHtmlTemplate); // insert template into page
    }
}


