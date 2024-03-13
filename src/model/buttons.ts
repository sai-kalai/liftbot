

/**
 * This module defines classes and enums used for creating and managing button
 * messages in a WhatsApp API context. It allows for the creation of different
 * types of buttons and lists of buttons based on predefined types, such as
 * motives, cities, and procedures.
 */

export enum ButtonTypes {
    MOTIVE = "motive",
    CITY = "city",
    PROCEDURE = "procedure",
    DEFAULT = "default"
}


export enum MotiveIDs {
    INFO = "info",
    APPO = "appo"
}

export enum CityIDs {
    MED = "med",
    BOG = "bog"
}

export enum ProcedureIDs {
    LIFT = "lift",
    LAMI = "lami",
    DEPI = "depi"
}

/**
 * Represents a single button with text and an identifier.
 * This class is used to create button elements that can be included in
 * WhatsApp messages.
 *
 * @property text - The display text of the button.
 * @property id - A unique identifier for the button, used for tracking interactions.
 */
export class Button {
    public text?: string;
    public id?: string;

    /**
     * Creates a new Button instance.
     * @param text - The display text of the button.
     * @param id - The unique identifier for the button.
     */
    constructor(text: string, id: string) {
        this.text = text;
        this.id = id;
    }
}

/**
 * Represents a list of buttons grouped by a specific type.
 * This class is useful for creating structured button layouts in
 * WhatsApp messages, allowing for categorization and grouping based
 * on the button type.
 *
 * @property type - The type of the buttons, based on the ButtonTypes enum.
 * @property buttons - An array of Button instances.
 */
export class ButtonsList {

    public static MOTIVE: Button[] = [
        new Button("Recibir información sobre los tratamientos", MotiveIDs.INFO),
        new Button("Agendar una cita", MotiveIDs.APPO),
    ];

    public static CITY: Button[] = [
        new Button("Medellín", CityIDs.MED),
        new Button("Bogotá", CityIDs.BOG),
    ];

    public static PROCEDURE: Button[] = [
        new Button("Lifting", ProcedureIDs.LIFT),
        new Button("Laminado", ProcedureIDs.LAMI),
        new Button("Depilación", ProcedureIDs.DEPI),
    ];

    public type: ButtonTypes = ButtonTypes.DEFAULT;
    public buttons: Button[] = [new Button("", ""),];

    /**
     * Creates a new ButtonsList instance.
     * @param t - The type of the button list, determining the buttons to be included.
     */
    constructor(t: ButtonTypes) {
        this.type = t;
        switch (t) {
            case ButtonTypes.MOTIVE:
                this.buttons = ButtonsList.MOTIVE;
                break;
            case ButtonTypes.CITY:
                this.buttons = ButtonsList.CITY;
                break;
            case ButtonTypes.PROCEDURE:
                this.buttons = ButtonsList.PROCEDURE;
                break;
        }
    }
}





