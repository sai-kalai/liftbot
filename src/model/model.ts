

// Data model
// Contains the data model
//
//


export enum ConversationStates {
    INITIAL = "City",  // Initial salutation, general information
    MOTIVE= "Motive",  // Ask user if they need information or to set up an appointment
    INFO = "Info",  // Give user info about the procedures
    APPO = "Appointment",  // Set up an appointment with the user
    COMPLETED = "Completed",   // Final words
    REMINDER = "Reminder",  // Remind user of their upcomming appointment
    RECOMMENDATIONS = "Recommendations",  // Give user recommendations on their treatment
    HUMAN = "Human", // Let a human continue with the conversation
  }


export type TextMessage = {
    type?: "text";
    senderNumber: string;
    textContent: string;
}

export type ButtonReply = {
    type?: "buttons";
    senderNumber: string;
    buttonReplyID: string;
    textContent: string;
}

export type Message = TextMessage | ButtonReply;
