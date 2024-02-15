





import 'tsconfig-paths/register';
import { httpPost, phoneIdEndpointEdges} from '@src/http/http';
import { MessageSender } from '@messaging/message-sender';

const defaultPhoneNumber = process.env.RECIPIENT_WAID as string; // My phone, for testing

const messageSender = new MessageSender(defaultPhoneNumber);

messageSender.sendButtonsMessage("mensaje", ["op1", "op2", "op3"])
