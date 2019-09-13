export class KeyEventHandler {
    constructor(messageHandler) {
        this.messageHandler = messageHandler;
        this.messageHandler.subscribe("doKeyPress", this.onKeyEvent.bind(this));
    }

    onKeyEvent(data) { // {keyCode}
        let keyboardEvent = new KeyboardEvent('keydown', { bubbles: true, keyCode: data.keyCode });
        window.document.dispatchEvent(keyboardEvent);
    }
}