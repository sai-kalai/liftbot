/*
 *
 * Main entrypoint for the webhooks app
 *
 * Sets up the /webhook endpoint to listen for HTTP
 *     - GET for verifying from the dashboard at https://developers.facebook.com/apps/198374483269405/whatsapp-business/wa-settings/?business_id=210540110141090&phone_number_id=
 *     - POST for  events like incoming messages
 */
import 'dotenv/config';
import 'tsconfig-paths/register';
// Imports dependencies and set up http server
import express, { Request, Response, text } from 'express';
import bodyParser from 'body-parser';

import { MessageSender } from '@messaging/message-sender';
import { SimpleBot } from '@src/bots/simple'
import { Message } from '@src/model/model';
import { from } from 'form-data';
const PORT = process.env.PORT || 1337;
console.log(`Port obtained from .env: ${PORT} (if undefined, will default to 1337)`);
const app = express();
app.use(bodyParser.json());
// Sets server port and logs a message on success
app.listen(PORT, () => console.log(`Webhook is listening on port ${PORT}`));

const bots: Record<string, SimpleBot> = {}

function verifyRequest(req: Request): Message | undefined {
  // Verifies that the post request constitutes a valid incoming message, and returns a Message object with the important attributes.
  if (req.body.object) {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];
    if (message) {
      const fromNumber = message.from;
      let messageBody = message.text?.body;
      const buttonReplyID = message.interactive?.button_reply.id;
      if (buttonReplyID) {
        messageBody = buttonReplyID
      }
      console.log(
        `Message webhook triggered:From whatsapp number: ${fromNumber}
Text content: ${messageBody}`);
      console.log("Full content: ", JSON.stringify(req.body, null, 4));
      const theMessage: Message = {
        senderNumber: fromNumber,
        textContent: messageBody,
        buttonReplyID: buttonReplyID
      }
      return theMessage
    } else { return }
  } else { return }
}

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req: Request, res: Response) => {
  console.log("received HTTP POST at /webhook");

  let message = verifyRequest(req);

  if (!message) {res.sendStatus(404); return}
  // Assuming from_number is extracted from the request (req) and properly declared
  const fromNumber = message.senderNumber;
  let bot: SimpleBot;
  if (fromNumber in bots) {
    bot = bots[fromNumber];
  } else {
    bot = new SimpleBot(
      new MessageSender(fromNumber)
    );
    bots[fromNumber] = bot
  }
  bot.handleMessage(message);
  console.log("Incoming message correctly handled, sending status code: ", 200)
  res.sendStatus(200);
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req: Request, res: Response) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  const mode = req.query["hub.mode"] as string;
  const token = req.query["hub.verify_token"] as string;
  const challenge = req.query["hub.challenge"] as string;

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      console.log("Invalid verify token. Access is forbidden")
      res.sendStatus(403);
    }
  }
});

