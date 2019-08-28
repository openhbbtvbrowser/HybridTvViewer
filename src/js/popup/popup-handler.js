/**
 * Handle changes to the popup. Exchange messages with background script.
 */
export class PopupHandler {
    constructor() {
        this.forcePluginCheckboxElement = document.getElementById("popup-checkbox-force-plugin");
        this.tabId;
        this.intitialize();

    }
    /**
     * Whenever the popup is opened the popup page is being reloaded.
     * Fetch current state from background page through the message bus. Show its current state. Then add change listeners.
     */
    intitialize() {
        new Promise((res, rej) => {
            // get currentTab
            chrome.tabs.query({ active: true, currentWindow: true }, res);
        }).then((tabs) => {
            this.tabId = tabs[0].id
            return new Promise((res, rej) => {
                this.sendMessage({ type: "getPopupState", tabId: this.tabId }, (response) => {
                    this.showState(response);
                    res();
                })
            })
        }).then(() => {
            this.forcePluginCheckboxElement.addEventListener("change", () => {
                this.sendMessage({
                    type: "setPopupState",
                    tabId: this.tabId,
                    message: {
                        forcePlugin: this.forcePluginCheckboxElement.checked
                    }
                },
                    () => {
                    });
            });
        })
    }
    /**
     * Set ui state.
     * @param {*} popupState 
     */
    showState(popupState) {
        if (!popupState) return;
        if (popupState.forcePlugin === true) {
            this.forcePluginCheckboxElement.checked = true;
        }
    }
    /**
     * Send message down the message bus. 
     * @param {*} messageObj 
     * @param {*} responseCallback 
     */
    sendMessage(messageObj, responseCallback) {
        chrome.runtime.sendMessage(messageObj, (response) => {
            responseCallback(response);
        });
    }
}
