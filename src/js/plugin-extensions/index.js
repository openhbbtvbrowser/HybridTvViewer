// compiled and injected into dom by webpack
import "../../css/hbb-extension-content-ui.scss";
import {BottomUi} from "./bottom-ui";
import {RemoteControl} from "./remote-control";
import { MessageHandler } from "./message-handler";

const bottomUi = new BottomUi();
bottomUi.start();

const iframeElem = document.getElementById("iframe-plugin");
const messageHandler = new MessageHandler(iframeElem);

const remoteControl = new RemoteControl(document.body, messageHandler, iframeElem);
remoteControl.initialize();

