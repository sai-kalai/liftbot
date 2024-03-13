//*
//  String processing utilities to build messages
//  Message templates are stored exclusively here.
//*

export class MessageTemplates {
  static showAllMessages(): string {
        const messages: string[] = [];
        for (const methodName of Object.getOwnPropertyNames(this)) {
            // Use a type assertion to convince TypeScript that this is a method returning a string
            const method: () => string = (this as any)[methodName];
            if (typeof method === 'function' && methodName !== 'showAllMessages') {
                messages.push(methodName, method());
            }
        }
        return "Printing all message templates: \n" + messages.join('\n ------------- \n');
    }
  static motive(): string { return "¿Qué deseas?"; }
  static info(): string {return "¿Qué procedimiento te interesa?"}

  static city(): string {
    return `Hola, ¿cómo estás? Mi nombre es Laura y soy la persona encargada de ayudarte 👩🏻.
    ¿En qué ciudad te encuentras?`
  }
  // Requesting information for setting up an appointment
  static setupAppointment(): string {
    return `Por favor déjanos estos datos para agendar tu cita 🧏🏻‍♀️, recuerda que si estás por fuera de Medellín tiene un costo adicional de $10.000.

- Ciudad:
- Barrio:
- Dirección completa:
- Hora tentativa y fecha:
- Nombre y número de contacto:
- Servicio(s):
- # de personas:

**POR FAVOR ENVÍA EN UN MISMO TEXTO TODOS ESTOS DATOS PARA CONFIRMAR TU CITA**.`
  }
  static outOfOfficeHours(): string { return "Nuestro horario de atención en redes es de 10 a.m a 6:30 p.m de LUNES a SÁBADO. ¡Feliz día! 🌿"}

  static infoLaminating(): string { return `Laminado de cejas MED
El **Laminado de Cejas** 👀 es una técnica que permite engrosar, ordenar y direccionar el vello de tus cejas para crear un look de cejas pobladas, definidas y maquilladas (**aprox 1 mes y medio**).
**Los precios ya incluyen el domicilio** 🛵.`
  }
  static infoLifting(): string {
    return `El **Lifting de Pestañas** 👁 es un tratamiento que alarga y crea una curva hacia arriba de manera natural y duradera (**aprox 2 meses**), consiguiendo mayor longitud y un efecto pestañina.

**Los precios ya incluyen el domicilio** 🛵.`
  }
  static address(): string {

    return `📍Cra 64A #48-55
Apto 702
Edificio Suramericana 8
Medellín, barrio Suramericana`
  }


}
