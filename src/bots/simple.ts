

import { MessageTemplates } from '@messaging/message-templates';
import { MessageSender } from '@messaging/message-sender';
import { Cities, Procedures, Message, ConversationStates, Motives } from '@src/model/model';


export class SimpleBot {
  conversationState: ConversationStates = ConversationStates.INITIAL;
  recipientPhoneNumber: string;
  sender: MessageSender;
  city?: Cities; // TODO add setters for convenience
  procedures?: Procedures[];

  constructor(messageSender: MessageSender) {
    this.sender = messageSender;
    this.recipientPhoneNumber = this.sender.dataPayload["to"];
    console.log("Creating new bot to communicate with phone number:", this.recipientPhoneNumber)
  }


  jumpToState(targetState: ConversationStates): void {
    this.conversationState = targetState;
    console.log("Bot conversing with: ", this.recipientPhoneNumber)
    console.log("Bot is jumping to state:", targetState)
  }

  handleMessage(message: Message): void {
    console.log("Bot conversing with: ", this.recipientPhoneNumber)
    console.log("Bot is handling message: ", message)
    switch (this.conversationState) {
      // Initial state
      case ConversationStates.INITIAL:
        // Ask about the city of the customer  TODO store city
        this.sender.sendButtonsMessage(MessageTemplates.city(), [Cities.MED, Cities.BOG])
        // Advance to the motive state
        this.jumpToState(ConversationStates.MOTIVE)
        break;
      case ConversationStates.MOTIVE:
        // Upon response, check case
        if (message.buttonReplyID == Motives.INFO) {
          this.jumpToState(ConversationStates.INFO); 
        } else if (message.buttonReplyID == Motives.APPO) {
          this.jumpToState(ConversationStates.APPO);
        } else {
          // Ask about the motive: the user either wants information or to set up an appointment
          this.sender.sendButtonsMessage("¿Qué deseas? ", [Motives.INFO, Motives.APPO])
        }
        break;
      case ConversationStates.INFO:
        console.log("Handling info state")
        break;
      case ConversationStates.APPO:
        console.log("Handling appo state")
        break;
      default:
        this.sender.sendTextMessage("Default response")
        break;
    }

  }
}
