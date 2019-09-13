import { MessageHandler } from "../shared/message-handler";
import { KeysetReporterService } from "./keyset-reporter";
import {StreamEventHandler} from "./streamevent-handler"
const messageHandler = new MessageHandler(window, window.parent);
const reporter = new KeysetReporterService(messageHandler);
reporter.initialize();
new StreamEventHandler(messageHandler);
