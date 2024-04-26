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
import { ButtonsMessage, Message } from '@src/model/model';
const PORT = process.env.PORT || 1337;
console.log(`Port obtained from .env: ${PORT} (if undefined, will default to 1337)`);
const app = express();
app.use(bodyParser.json());
// Sets server port and logs a message on success
app.listen(PORT, () => console.log(`Webhook is listening on port ${PORT}`));

const bots: Record<string, SimpleBot> = {}
// TODO: include envent handling to filter and handle the incomming events
function verifyRequest(req: Request): Message | undefined {// TODO: Use option monad in v0.2
    // Verifies that the post request constitutes a valid incoming message, and returns a Message object with the important attributes.
    if (!req.body.object) return;
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];
    if (!message) return;
    const fromNumber = message.from;
    const messageID = message.id;
    const messageBody = message.text?.body;
    const buttonReply = message.interactive?.button_reply;
    const buttonReplyID = buttonReply?.id;
    const buttonReplyText = buttonReply?.title
    console.log(
        `Message webhook triggered:From whatsapp number: ${fromNumber}
Text content: ${messageBody}`);
    // console.log("Full content: ", JSON.stringify(req.body, null, 4));
    if (buttonReply) {
        const theMessage: ButtonsMessage = {
            type: "buttons",
            senderNumber: fromNumber,
            textContent: buttonReplyText,
            buttonReplyID: buttonReplyID
        }
        console.log("Received button reply message: ", theMessage);
        return theMessage;
    } else {
        const theMessage: Message = {
            type: "text",
            senderNumber: fromNumber,
            textContent: messageBody,
        }
        console.log("Received text message: ", theMessage);
        return theMessage;
    }
}

// FIX: bug: make sure to send a response status code to the triggeror of the webhook. currently no code `200` is being sent.

/** Handles POST requests made to the `/webhooks` endpoint.
 * Intended use is to catch POST requests made by the facebook meta graph API.
 * This happens whenever an user interacts with the WhatsApp number associated
 * with the chatbot app. This information should be configured in the .env file.
 * The main cases of such interaction are:
 *   - user sends a whatsapp message to the number
 *   - the status of a message in the conversation updates
 *      - the message is read
 *      - the message is reacted to
 *      - the message is replied to
 *      - full list available in (the whebhooks config)[https://developers.facebook.com/apps/198374483269405/webhooks/?business_id=210540110141090]
 * */
app.post("/webhook", (req: Request, res: Response) => {
    // Handle the POST request incomming to the listener app
    console.debug("received HTTP POST request at /webhook");

    const message = verifyRequest(req);

    console.log("Message: ", message);

    let code;
    // Guard clause for messages that fail to verify
    if (!message) { code = 400; console.debug(`Request is not a valid message. Sending response code ${code}`); res.sendStatus(code); return } // For now only pay attention to messages. Later implementations should use event handling.
    // Assuming from_number is extracted from the request (req) and properly declared
    const fromNumber = message.senderNumber;
    let bot: SimpleBot;
    if (fromNumber in bots) {
        bot = bots[fromNumber];
    } else {
        bot = new SimpleBot(new MessageSender(fromNumber));
        bots[fromNumber] = bot
    }
    bot.handleMessage(message);
    // FIX: sending code 200 but no behavior appreciable during tests. include error handling inside above
    // investigating further revealed that it might be a problem of authenticating the webhooks endpoint url.
    code = 200;
    console.debug(`No error during message handling POST request. Sending response with status code ${code}`)
    res.sendStatus(code);
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
// this is for the purpose of authenticating the webhooks app to facebook
app.get("/webhook", (req: Request, res: Response) => {
    /**
     * UPDATE YOUR VERIFY TOKEN
     *This will be the Verify Token value when you set up webhook
     **/
    console.log("Received a GET request");
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
