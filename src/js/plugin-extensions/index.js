// compiled and injected into dom by webpack
import "../../css/hbb-extension-content-ui.scss";
import { BottomUi } from "./bottom-ui";
import { RemoteControl } from "./remote-control";
import { MessageHandler } from "../shared/message-handler";

// setTimeout(() => {

    const iframeElem = document.getElementById("iframe-plugin");
    // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", "start messageHandler", iframeElem);
    const messageHandler = new MessageHandler(window, iframeElem.contentWindow);

    const bottomUi = new BottomUi(messageHandler);
    bottomUi.initialize();

    // setInterval(() => {
    //     console.log("now sending from main");

    //     messageHandler.sendMessage("hello iframe"), 1000;
    // }, 3000)
    const remoteControl = new RemoteControl(document.body, messageHandler, iframeElem);
    remoteControl.initialize();
// }, 1000)

