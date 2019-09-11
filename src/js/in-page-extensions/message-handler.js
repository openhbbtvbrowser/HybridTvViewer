
/**
 * Enable bidirectional message passing between iframe and parent.
 */
export class MessageHandler {
    constructor() {
        window.addEventListener("message", this.onMessage, false);
    }

    onMessage(message) {
        try {
            console.log("iframe got message.data", message.data)
        }
        catch (e) {
            console.log(e);
        }
    };
    sendMessage(message) {
        window.parent.postMessage(message);
    }
}