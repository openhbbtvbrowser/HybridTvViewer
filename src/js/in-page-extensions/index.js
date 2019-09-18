import { MessageHandler } from "../shared/message-handler";
import { StateReporterService } from "./state-reporter";
import {StreamEventHandler} from "./streamevent-handler"
import {KeyEventHandler} from "./keyevent-handler"
const messageHandler = new MessageHandler(window, window.parent);
const reporter = new StateReporterService(messageHandler);
reporter.initialize();
new StreamEventHandler(messageHandler);
new KeyEventHandler(messageHandler);
