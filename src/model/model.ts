

// Data model
// Contains the data model
//
//


export enum ConversationStates {
    INITIAL = "Initial",  // Initial salutation, general information
    MOTIVE= "Motive",  // Ask user if they need information or to set up an appointment
    INFO = "Info",  // Give user info about the procedures
    APPO = "Appointment",  // Set up an appointment with the user
    COMPLETED = "Completed",   // Final words
    REMINDER = "Reminder",  // Remind user of their upcomming appointment
    RECOMMENDATIONS = "Recommendations",  // Give user recommendations on their treatment
    HUMAN = "Human", // Let a human continue with the conversation
  }

export enum Motives {
    INFO = "Recibir información sobre los tratamientos",
    APPO = "Agendar una cita"
}

export enum Cities {
    MED = "Medellín",
    BOG = "Bogotá"
}

export enum Procedures {
    LIFT = "Lifting",
    LAMI = "Laminado",
    DEPI = "Depilación"
}


export type Message = {
    senderNumber: string;
    textContent: string;
    buttonReplyID?: string;
}