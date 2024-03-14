

import { MessageTemplates } from '@messaging/message-templates';
import { MessageSender } from '@messaging/message-sender';
import * as model from '@src/model/model';
import * as buttons from '@src/model/buttons';
import {ConversationStates} from '@src/model/model';
import { ButtonTypes, ButtonsList } from '@src/model/buttons';


export class SimpleBot {
  conversationState: ConversationStates = ConversationStates.CITY;
  recipientPhoneNumber: string;
  sender: MessageSender;
  city?: string; // TODO add setters for convenience
  procedures?: string[];

  constructor(messageSender: MessageSender) {
    this.sender = messageSender;
    this.recipientPhoneNumber = this.sender.dataPayload["to"];
    console.log("Creating new bot to communicate with phone number:", this.recipientPhoneNumber)
  }


  jumpToState(targetState: ConversationStates): void {
    this.conversationState = targetState;
    console.log("Bot conversing with: ", this.recipientPhoneNumber)
    console.log("is jumping to state:", targetState)
  }

  async handleMessage(message: model.Message) {
    console.log("Bot conversing with: ", this.recipientPhoneNumber)
    console.log("Bot is handling message: ", message)

    if (message.type === "text") { this.handleTextMessage(message) }
    else if (message.type === "buttons") { this.handleButtonsMessage(message)}
  }

  //  Buttons messages are used to obtain information from the user.
  //  They must
  //    - store the information sent by the user, e.g. city or procedures
  //    - advance the conversation state to the correct stage
  //    - send the message pertaining to the next stage
  handleButtonsMessage(message: model.ButtonsMessage) {
    switch (this.conversationState) {
      // Initial state
      case ConversationStates.CITY:
        this.city = message.textContent;  // Store city
        this.jumpToState(ConversationStates.MOTIVE);  // Change the bot's state
        this.sender.sendButtonsMessage(  // send the next buttons message
          MessageTemplates.motive(),
          new ButtonsList(ButtonTypes.MOTIVE)
        )
        break;
      case ConversationStates.MOTIVE:
        // Upon response, check case of motive
        if (message.buttonReplyID === buttons.MotiveIDs.INFO) {
          this.jumpToState(ConversationStates.INFO);
          this.sender.sendButtonsMessage(
            MessageTemplates.info(),
            new ButtonsList(ButtonTypes.PROCEDURE)
          );
        } else if (message.buttonReplyID === buttons.MotiveIDs.APPO) {
          this.jumpToState(ConversationStates.APPO);

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
  handleTextMessage(message: model.TextMessage) {
    // Handles reception of normal text messages
    // At conversation onset, simply sends greeting and sends button message.

    console.log("Bot is handling text message: ", message)
    switch (this.conversationState) {
      // Initial state
      case ConversationStates.CITY:
        //  Send welcome message and then send ooptions to select city
        this.sender.sendButtonsMessage(
          MessageTemplates.city(),
          new ButtonsList(ButtonTypes.CITY)
        )
    }
  }
}
