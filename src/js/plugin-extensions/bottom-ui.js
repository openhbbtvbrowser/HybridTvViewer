// This one needs to be loaded via webpack html-loader
import * as bottomUIHtmlTemplate from "./bottom-ui-template.html"

export class BottomUi {

    constructor(messageHandler) {
        this.bottomUiDiv;
        this.messageHandler = messageHandler;
        this.messageHandler.subscribe("iframeLocation", this.onIframeLocation.bind(this));
    }

    onIframeLocation(data) {// {href}
        document.getElementById("text-location").innerHTML = data.href;
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
        const saveUAButton = document.getElementById("input-useragent-save");
        if (saveUAButton) {
            saveUAButton.addEventListener("click", () => {
                this.saveUA();
            })
        }
        // get config and set user agent in ui
        this._sendMessageToBackgroundScript({type: "getPolyfillBaseConfig"}, (data) => {
            const userAgent = data.userAgent || navigator.userAgent;
            document.getElementById("input-useragent").value = userAgent;
        });

    }

    saveUA() {
        const ua = document.getElementById("input-useragent").value;
        new Promise((res, rej) => {
            this._sendMessageToBackgroundScript({ type: "userAgent", data: { userAgent: ua } });
        })
    }

    submitStreamEvent() {
        const data = document.getElementById("input-streamevent-data").value;
        const name = document.getElementById("input-streamevent-name").value;
        const text = document.getElementById("input-streamevent-text").value;

        this.messageHandler.sendMessage({ topic: "streamevent", data: { name, data, text } })
    }


    /**
    * Send message down the message bus. 
    * @param {*} messageObj 
    * @param {*} responseCallback 
    */
    _sendMessageToBackgroundScript(messageObj, responseCallback) {
        chrome.runtime.sendMessage(messageObj, (response) => {
            responseCallback && responseCallback(response);
        });
    }

}


