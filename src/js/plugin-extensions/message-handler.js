
/**
 * Enable bidirectional message passing between this
 * window and the embedded iframe where the hbbtv view is being rendered.
 */
export class MessageHandler {
    /**
     * 
     * @param {*} iframeElem - target iframe
     */
    constructor(iframeElem) {
        this.iframeElem = iframeElem;
        this.listeners = new Map(); // key: type, val: array(callbacks)
        window.addEventListener("message", this.onMessage.bind(this), false);
    }

    onMessage(message) {
        try {
            // console.log("parent got message.data", message.data)
            const topic = message.data.topic;
            const callbacks = this.listeners.get(topic);
            for(let callback of callbacks){
                callback(message.data.data);
            }
        }
        catch (e) {
            console.error(e);
        }
    };

    sendMessage(message) {
        this.iframeElem.contentWindow.postMessage(message);
    }

    subscribe(topic, callback){
        const callbacks = this.listeners.get(topic);
        if(callbacks){
            callbacks.push(callback);
            this.listeners.set(topic, callback);
        } else {
            this.listeners.set(topic, [callback])
        }
    }
}