

// Thin wrapper around axios
// This handles all HTTP requests

import 'dotenv/config';
import axios from 'axios';
import FormData from 'form-data';

const accessToken = process.env.ACCESS_TOKEN as string;
const defaultPhoneNumber = process.env.RECIPIENT_WAID as string; // My phone, for testing
const phoneNumberID = process.env.PHONE_NUMBER_ID;  // LIFT phone number
const apiVersion = process.env.VERSION;

const apiVersionUrl = `https://graph.facebook.com/${apiVersion}`;  // needed independently

const phoneIdEndpointURL = `${apiVersionUrl}/${phoneNumberID}`;
export enum phoneIdEndpointEdges {
    MEDIA = "media",
    MESSAGES = "messages"
}


const headers: Record<string, string> = {
    "Authorization": `Bearer ${accessToken}`
}

export async function httpPost(
    edge: phoneIdEndpointEdges,
    data: object | FormData,  // Upstream functions should ensure that the passed object || form data is correctly formatted.
) {
    // Perform POST request to the Phone ID endpoint to send messages, upload media and TODO more.
    // Can handle text messages or media messages.
    const url = `${phoneIdEndpointURL}/${edge}`;
    // Set the correct header depending on the case
    if (data instanceof FormData) {  // If data is a form
        Object.assign(headers, data.getHeaders());
    } else { // If data is not a Form
        headers["Content-Type"] = "application/json";
    }
    console.log("Preparing to make POST request...");
    console.log("URL: ", url);

    try {
        const response = await axios.post(url, data, { headers });
        console.log("Post request sent.");
        console.log("   url: ", url);
        console.log("   status code: ", response.status)
        console.log("   body: ", response.data)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Handle Axios-specific error
            console.error("Axios error occurred:", error.message);
            if (error.response) {
                console.error("Server responded with status:", error.response.status);
                console.error("Response data:", error.response.data);
            }
        } else {
            // Handle generic errors
            console.error("Error making API request:", error);
        }
    }
}


export async function httpDelete(mediaID: string) {
    const url = `${apiVersionUrl}/${mediaID}`;
    const response = await axios.delete(url, {headers});

    return response
}


