
import 'dotenv/config';
import 'tsconfig-paths/register';
// Imports dependencies and set up http server

import { phoneIdEndpointEdges, httpPost } from '@src/http/http';
import * as model from '@src/model/model';
const defaultPhoneNumber = process.env.RECIPIENT_WAID as string;
import { ButtonsList, Button, ButtonTypes } from '@src/model/buttons';

export class MessageSender {
  dataPayload: Record<string, string>;

  constructor(recipientPhoneNumber: string) {
    this.dataPayload = {  // Baseline definition of the object
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": recipientPhoneNumber
    }
    ;
  }
  sendTextMessage(msg: string, mediaID?: string): void {
    console.log("Sending text message: ", msg, "Media ID: ", mediaID);
    const dataPayload = this.dataPayload;
    if (mediaID) {
      Object.assign(dataPayload, {
        "type": "image",
        "image": {
          "id": mediaID,
          "caption": msg
        }
      })
    } else {
      Object.assign(this.dataPayload, {
        "type": "text",
        "text": {
          "body": msg
        }
      })
    }
    console.log("Preparing to send text/image message.");
    console.log(" data: ", this.dataPayload);
    httpPost(phoneIdEndpointEdges.MESSAGES, this.dataPayload);
  }

  sendButtonsMessage(msg: string, options: ButtonsList) {
    console.log("Sending buttons message: ", msg, "Options: ", options.buttons);
    const dataPayload = this.dataPayload;
    Object.assign(dataPayload,
      {
        "type": "interactive",
        "interactive": {
          "type": "button",
          "body": {
            "text": msg
          },
          "action": {
            "buttons": options.buttons.map((option) => {
              return {
                "type": "reply",
                "reply": {
                  "id": option.id,
                  "title": option.text
                }
              }

            })
          }
        }
      })

    httpPost(phoneIdEndpointEdges.MESSAGES, dataPayload);
  }


}


const messageSender = new MessageSender(defaultPhoneNumber)
messageSender.sendTextMessage("Hola Mundo")
