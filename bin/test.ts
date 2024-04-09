





import 'tsconfig-paths/register';
import { httpPost, phoneIdEndpointEdges} from '@src/http/http';
import { MessageSender } from '@messaging/message-sender';
import { MessageTemplates } from '@messaging/message-templates';

const defaultPhoneNumber = process.env.RECIPIENT_WAID as string; // My phone, for testing

const ms = new MessageSender(defaultPhoneNumber);

const mt = MessageTemplates;

ms.sendTextMessage(mt.showAllMessages())
