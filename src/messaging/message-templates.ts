//*
//  String processing utilities to build messages
//  Message templates are stored exclusively here.
//*

import { CityIDs, ProcedureIDs } from "@src/model/buttons";
import { MessageSender } from "./message-sender";

export class MessageTemplates {
  static showAllMessages(): string {
    const messages: string[] = [];
    for (const methodName of Object.getOwnPropertyNames(this)) {
      // Use a type assertion to convince TypeScript that this is a method returning a string
      const method: () => string = (this as any)[methodName];
      if (typeof method === "function" && methodName !== "showAllMessages") {
        messages.push(methodName, method());
      }
    }
    return "Printing all message templates: \n" +
      messages.join("\n ------------- \n");
  }
  static motive(): string {
    return `Este es el menú principal. *Para volver acá en cualquier momento, solo debes escribir \"Inicio\"*.
¿Cómo te puedo ayudar hoy?`;
  }
  static info(): string {
    return "¿Qué procedimiento te interesa?";
  }

  static city(): string {
    return `Hola, ¿cómo estás? Mi nombre es LauBot 🤖 y soy tu asistente virtual. Para mí será un gusto ayudarte 👩.
Para empezar dime, ¿en qué ciudad te encuentras?`;
  }
  static appointmentLocation(): string {
    return "¿Deseas que la cita sea en el local o a domicilio?";
  }
  // Requesting information for setting up an appointment
  static setupAppointment(cityID: string): string {
    return `Por favor déjanos estos datos para agendar tu cita 🧏🏻‍♀️${
      (cityID === CityIDs.MED)
        ? ", recuerda que si estás por fuera del distrito de Medellín tiene un costo adicional de $10.000."
        : "."
    }
- Ciudad:
- Barrio:
- Dirección completa:
- Hora y fecha tentativas:
- Nombre y número de contacto:
- # de personas:
- Servicio(s) que recibirá cada persona:

*POR FAVOR ENVÍA EN UN MISMO TEXTO TODOS ESTOS DATOS PARA CONFIRMAR TU CITA*.
En un momento nos comunicaremos contigo para agendar la cita 😉.`;
  }
  static outOfOfficeHours(): string {
    return "Nuestro horario de atención en redes es de 10 a.m a 6:30 p.m de LUNES a SÁBADO. ¡Feliz día! 🌿";
  }

  static procedureInfo(procedureID: ProcedureIDs): string {
    if (procedureID === ProcedureIDs.LAMI) {
      return `El *Laminado de Cejas* 👀 es una técnica que permite engrosar, ordenar y direccionar el vello de tus cejas para crear un look de cejas pobladas, definidas y maquilladas (*aprox 1 mes y medio*).
*Los precios ya incluyen el domicilio* 🛵.`;
    } else if (procedureID === ProcedureIDs.LIFT) {
      return `El *Lifting de Pestañas* 👁 es un tratamiento que alarga y crea una curva hacia arriba de manera natural y duradera (*aprox 2 meses*), consiguiendo mayor longitud y un efecto pestañina.
*Los precios ya incluyen el domicilio* 🛵.`;
    } else if (procedureID === ProcedureIDs.DEPI) {
      return " ";
    } else {
            return "  ";  //  FIX: Indidious bug: function will be called even if none of the enum variants are satisfied... handle maybe undefined return.
        }
  }
  static onsite(): string {
    return `Espera un momento para agendar tu cita.\nPor favor dinos la fecha y hora tentativas y en un momento nos comunicaremos contigo 🌿😊`;
  }
}
