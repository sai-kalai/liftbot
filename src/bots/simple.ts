import { MessageTemplates } from "@messaging/message-templates";
import { MessageSender } from "@messaging/message-sender";
import * as model from "@src/model/model";
import * as buttons from "@src/model/buttons";
import { ConversationStates } from "@src/model/model";
import { ButtonsList, ButtonTypes } from "@src/model/buttons";
import { getFileMediaID } from "@src/media/media";

/**
 * The SimpleBot class is designed to handle messaging interactions in a structured conversation flow.
 * It maintains the state of the conversation, handles different types of messages (text and buttons),
 * and responds accordingly based on the current state and the input received from the user.
 */
export class SimpleBot {
  /**
   * The current state of the conversation. Determines the bot's response logic.
   */
  conversationState: ConversationStates = ConversationStates.INITIAL;

  /**
   * The phone number of the message recipient.
   */
  recipientPhoneNumber: string;

  /**
   * An instance of MessageSender used to send messages.
   */
  sender: MessageSender;

  /**
   * The selected city in the conversation. Optional because it may not be set initially.
   */
  city?: string;

  /**
   * A list of selected procedures in the conversation. Optional because it may not be set initially.
   */
  procedures?: string[];

  /**
   * Constructs a new SimpleBot instance.
   * @param {MessageSender} messageSender - The message sender instance used for sending messages.
   */
  constructor(messageSender: MessageSender) {
    this.sender = messageSender;
    this.recipientPhoneNumber = this.sender.dataPayload["to"];
    console.log(
      "Creating new bot to communicate with phone number:",
      this.recipientPhoneNumber,
    );
  }

  /**
   * Changes the conversation state to the specified target state.
   * @param {ConversationStates} targetState - The target state to jump to.
   */
  jumpToState(targetState: ConversationStates): void {
    this.conversationState = targetState;
    console.log("Bot conversing with: ", this.recipientPhoneNumber);
    console.log("is jumping to state:", targetState);
  }

  /**
   * Handles incoming messages and routes them based on their type.
   * @param {model.Message} message - The incoming message.
   */
  async handleMessage(message: model.Message) {
    console.log("Bot conversing with: ", this.recipientPhoneNumber);
    console.log("Bot is handling message: ", message);

    if (message.type === "text") this.handleTextMessage(message);
    else if (message.type === "buttons") this.handleButtonsMessage(message);
  }

  /**
   * Resets the conversation to the motive selection state.
   */
  resetToMotive() {
    this.jumpToState(ConversationStates.MOTIVE);
    this.sender.sendButtonsMessage(
      MessageTemplates.motive(),
      new ButtonsList(ButtonTypes.MOTIVE),
    );
  }

  /**
   * Handles button message interactions. Based on the current conversation state,
   * it processes the button reply, stores relevant information, advances the conversation,
   * and sends appropriate follow-up messages.
   * @param {model.ButtonsMessage} message - The button message to handle.
   */
  handleButtonsMessage(message: model.ButtonsMessage) {
    switch (this.conversationState) {
      // Handle each conversation state separately
      case ConversationStates.INITIAL:
        // Store city ID and proceed to the next state
        this.city = message.buttonReplyID;
        this.resetToMotive();
        break;
      case ConversationStates.MOTIVE:
        // Handle different motives and transition to the corresponding state
        if (message.buttonReplyID === buttons.MotiveIDs.INFO) {
          this.jumpToState(ConversationStates.INFO);
          this.sender.sendButtonsMessage(
            MessageTemplates.info(),
            new ButtonsList(ButtonTypes.PROCEDURE),
          );
        } else if (message.buttonReplyID === buttons.MotiveIDs.APPO) {
          this.jumpToState(ConversationStates.APPO);
          // Different flow based on city selection
          if (this.city === buttons.CityIDs.MED) {
            this.sender.sendButtonsMessage(
              MessageTemplates.appointmentLocation(),
              new ButtonsList(ButtonTypes.APPO),
            );
          } else if (this.city === buttons.CityIDs.BOG) {
            this.sender.sendTextMessage(MessageTemplates.setupAppointment(buttons.CityIDs.BOG));
          }
        }
        break;

      case ConversationStates.INFO: {
        // Handle the information state and send procedure information
        console.log("Handling info state");
        const procedureID = message.buttonReplyID as buttons.ProcedureIDs;
        const fileName = `${procedureID}_${this.city}.jpeg`;
        const mediaID = getFileMediaID(fileName);
        this.sender.sendTextMessage(
          MessageTemplates.procedureInfo(procedureID),
          mediaID,
        );
        break;
      }
      case ConversationStates.APPO:
        // Handle appointment setting state
        console.log("Handling appo state");
        if (message.buttonReplyID === buttons.AppointmentLocationIDs.DOMICILE) {
          this.sender.sendTextMessage(
            MessageTemplates.setupAppointment(this.city as string),
          );
        } else if (
          message.buttonReplyID === buttons.AppointmentLocationIDs.ONSITE
        ) {
          this.sender.sendTextMessage(MessageTemplates.onsite());
        }
        break;

      default:
        // Fallback response for undefined states
        this.sender.sendTextMessage("Default response");
        break;
    }
  }

  /**
   * Handles text message interactions. This method is primarily used at the beginning of the conversation
   * to initiate the flow based on text input and to respond to unexpected text messages during the conversation.
   * @param {model.TextMessage} message - The text message to handle.
   */
  handleTextMessage(message: model.TextMessage) {
    const text = message.textContent;

    // If the message includes "inicio", reset to the motive selection state.
    if (text.toLowerCase().includes("inicio")) {
      this.resetToMotive();
    }

    console.log("Bot is handling text message: ", message);

    // Handle text messages based on the current conversation state
    switch (this.conversationState) {
      case ConversationStates.INITIAL:
        // If in CITY state, prompt user to select a city
        this.sender.sendButtonsMessage(
          MessageTemplates.city(),
          new ButtonsList(ButtonTypes.CITY),
        );
        break;
    }
  }
}
