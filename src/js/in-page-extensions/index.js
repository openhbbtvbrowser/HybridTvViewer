import { MessageHandler } from "./message-handler";
import { KeysetReporterService } from "./keyset-reporter";

const messageHandler = new MessageHandler();
const reporter = new KeysetReporterService(messageHandler);
reporter.initialize();
