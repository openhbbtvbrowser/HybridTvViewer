
// needs to be loaded with webpack html-loader 
import * as remoteTemplate from "./remote-control-template.html";

import { PC_KEYCODES } from "../shared/pc-keycodes.js";
/**
 * Update remote control classes based on input from iframe through messageHandler.
 * Dispatch keyevents on iframe on button clicks.
 */
export class RemoteControl {
    constructor(node, messageHandler, iframe) {
        this.iframe = iframe;
        node.insertAdjacentHTML("beforeend", remoteTemplate); // insert template into page
        this.controlButtons = undefined;
        this.messageHandler = messageHandler;
        this.VK = {
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
        this.messageHandler.subscribe("keyset", this.updateKeyset.bind(this));
    }

    initialize() {
        this.controlButtons = {
            red: document.querySelectorAll(".red-button"),
            green: document.querySelectorAll(".green-button"),
            yellow: document.querySelectorAll(".yellow-button"),
            blue: document.querySelectorAll(".blue-button"),
            navigation: document.querySelectorAll(".navigation"),
            vcr: document.querySelectorAll(".vcr"),
            numeric: document.querySelectorAll(".numeric"),
        };
        document.getElementById("power-button").onclick = () => {
            document.location.reload();
        };
    }

    enableVCR() {
        for (let button of this.controlButtons.vcr) {
            if (button.classList.contains("rewind")) {
                this.enableButton(button, PC_KEYCODES.h);
            }
            if (button.classList.contains("play")) {
                this.enableButton(button, PC_KEYCODES.j);
            }
            if (button.classList.contains("pause")) {
                this.enableButton(button, PC_KEYCODES.k);
            }
            if (button.classList.contains("stop")) {
                this.enableButton(button, PC_KEYCODES.l);
            }
            if (button.classList.contains("fast_forward")) {
                this.enableButton(button, PC_KEYCODES.oe);
            }
        }
    }

    disableVCR() {
        for (let button of this.controlButtons.vcr) {
            this.disableButton(button);
        }
    }

    enableGreen() {
        for (let button of this.controlButtons.green) {
            this.enableButton(button, PC_KEYCODES.g);
        }
    }

    disableGreen() {
        for (let button of this.controlButtons.green) {
            this.disableButton(button);
        }
    }

    enableNavigation() {
        for (let button of this.controlButtons.navigation) {
            if (button.classList.contains("up")) {
                this.enableButton(button, PC_KEYCODES.up);
            }
            if (button.classList.contains("down")) {
                this.enableButton(button, PC_KEYCODES.down);
            }
            if (button.classList.contains("left")) {
                this.enableButton(button, PC_KEYCODES.left);
            }
            if (button.classList.contains("right")) {
                this.enableButton(button, PC_KEYCODES.right);
            }
            if (button.classList.contains("ok")) {
                this.enableButton(button, PC_KEYCODES.enter);
            }
            if (button.classList.contains("return")) {
                this.enableButton(button, PC_KEYCODES.back);
            }
        }
    }


    disableNavigation() {
        for (let button of this.controlButtons.navigation) {
            this.disableButton(button);
        }
    }

    enableNumeric() {
        for (let button of this.controlButtons.numeric) {
            if (button.classList.contains("one")) {
                this.enableButton(button, PC_KEYCODES["1"]);
            }
            if (button.classList.contains("two")) {
                this.enableButton(button, PC_KEYCODES["2"]);
            }
            if (button.classList.contains("three")) {
                this.enableButton(button, PC_KEYCODES["3"]);
            }
            if (button.classList.contains("four")) {
                this.enableButton(button, PC_KEYCODES["4"]);
            }
            if (button.classList.contains("five")) {
                this.enableButton(button, PC_KEYCODES["5"]);
            }
            if (button.classList.contains("six")) {
                this.enableButton(button, PC_KEYCODES["6"]);
            }
            if (button.classList.contains("seven")) {
                this.enableButton(button, PC_KEYCODES["7"]);
            }
            if (button.classList.contains("eight")) {
                this.enableButton(button, PC_KEYCODES["8"]);
            }
            if (button.classList.contains("nine")) {
                this.enableButton(button, PC_KEYCODES["9"]);
            }
            if (button.classList.contains("zero")) {
                this.enableButton(button, PC_KEYCODES["0"]);
            }

        }
    }

    disableNumeric() {
        for (let button of this.controlButtons.numeric) {
            this.disableButton(button);
        }
    }

    enableRed() {
        for (let button of this.controlButtons.red) {
            this.enableButton(button, PC_KEYCODES.r);
        }
    }

    disableRed() {
        for (let button of this.controlButtons.red) {
            this.disableButton(button);
        }
    }

    enableYellow() {
        for (let button of this.controlButtons.yellow) {
            this.enableButton(button, PC_KEYCODES.y);
        }
    }

    disableYellow() {
        for (let button of this.controlButtons.yellow) {
            this.disableButton(button);
        }
    }

    enableBlue() {
        for (let button of this.controlButtons.blue) {
            this.enableButton(button, PC_KEYCODES.b);
        }
    }

    disableBlue() {
        for (let button of this.controlButtons.blue) {
            this.disableButton(button);
        }
    }

    addButtonControls() {
        red.onclick = () => {
            this.doKeyPress(82);
        };
    }

    updateView() {
        this.updateKeyset();
    }

    doKeyPress(keyCode) {
        this.messageHandler.sendMessage({ topic: "doKeyPress", data: { keyCode } });
        // let keyboardEvent = new KeyboardEvent('keydown', { bubbles: true, keyCode });
        // this.iframe.contentWindow.document.dispatchEvent(keyboardEvent);

    }

    /**
     * Activate button and set event listeners.
     * @param {*} node 
     * @param {*} keyCode 
     */
    enableButton(node, keyCode) {
        if (node.classList.contains("inactive")) {
            node.classList.remove("inactive");
            if (node.clickListener) {
                node.clickListener = node.removeEventListener("click", node.clickListener);
                delete node.clickListener;
            }
            const listener = () => {
                this.doKeyPress(keyCode);
            };
            node.clickListener = listener;
            node.addEventListener("click", listener);
        }
    }

    /**
     * Disable button.
     * @param {*} node 
     */
    disableButton(node) {
        if (!node.classList.contains("inactive")) {
            node.classList.add("inactive");
            node.clickListener = node.removeEventListener("click", node.clickListener);
            delete node.clickListener;
        }

    }

    updateKeyset(keyset) {
        keyset.VCR ? this.enableVCR() : this.disableVCR();
        keyset.GREEN ? this.enableGreen() : this.disableGreen();
        keyset.YELLOW ? this.enableYellow() : this.disableYellow();
        keyset.BLUE ? this.enableBlue() : this.disableBlue();
        keyset.RED ? this.enableRed() : this.disableRed();
        keyset.NAVIGATION ? this.enableNavigation() : this.disableNavigation();
        keyset.NUMERIC ? this.enableNumeric() : this.disableNumeric();
    }
}