// This one needs to be loaded via webpack html-loader
import * as bottomUIHtmlTemplate from "./bottom-ui-template.html"

export class BottomUi {

    constructor(messageHandler) {
        this.bottomUiDiv;
        this.messageHandler = messageHandler;
    }

    initialize() {
        // add container
        const body = document.getElementsByTagName("body")[0];
        body.insertAdjacentHTML("beforeend", bottomUIHtmlTemplate); // insert template into page
        const submitStreamEventButton = document.getElementById("input-streamevent-submit");
        if (submitStreamEventButton) {
            submitStreamEventButton.addEventListener("click", () => {
                this.submitStreamEvent();
            })
        }
    }

    submitStreamEvent() {
        const data = document.getElementById("input-streamevent-data").value;
        const name = document.getElementById("input-streamevent-name").value;
        const text = document.getElementById("input-streamevent-text").value;

        this.messageHandler.sendMessage({ topic: "streamevent", data: { name, data, text } })
    }

}


