module.exports = {
    translation : {
        'LAUNCH' : 'Hallo, Ich bin Net ilion. Du kannst mich nach dem Füllstand, der Temperatur oder die gemessene Distanz eines verbundenen Messgeräts über dessen Tag fragen. Was würdest du gerne wissen?',
        'RESPONSE': '%s von %s ist %s %s.',
        'UNRESOLVED_INSTRUMENTATION': 'Leider konnte ich keine Instrumentierungsdaten für den Tag %s finden.',
        'UNRESOLVED_ASSET': 'Leider konnte ich keine Gerätedaten für den Tag %s finden.',
        'UNRESOLVED_VALUE': 'Leider konnte ich keine Messwerte für den Tag %s finden.',
        'UNRESOLVED_VALUE_TYPE': 'Leider konnte ich keinen %s Messwert für den Tag %s finden.',
        'HELP': 'Du kannst mich nach dem Messstand, der Temperatur oder dem gemessenen Abstand fragen eines verbundenen Messgeräts über dessen Tag. Wie kann ich helfen?',
        'STOP': 'Bis bald!',
        'DEBUG_REFLECT': 'Du has gerade %s aufgerufen.',
        'ERROR': 'Leider konnte ich keine Daten für den Tag %s finden.',
        'UNHANDLED_ERROR': 'Entschuldige, aber ich konnte deinen Befehl leider nicht ausführen. Bitte versuch es nochmal.'
    },
    mapUnit: function(unitObject) {
        if (!unitObject || !unitObject.code || !unitObject.name) {
            return '';
        }
        if (unitObject.code === 'percent') {
            return 'Prozent';
        }
        if (unitObject.code === 'degree_celsius') {
            return "Grad Celisius";
        }
        if (unitObject.code === 'degree_fahrenheit') {
            return "Grad Fahrenheit";
        }
        if (unitObject.code === 'millimetre') {
            return 'Millimeter'
        }
        if (unitObject.code === 'centimetre') {
            return 'Zentimeter'
        }
        return unitObject.name;
    },
    mapValueTypeWithArticle: function(valueType) {
        if (valueType === 'level') {
            return 'der Füllstand'
        }
        if (valueType === 'temperature') {
            return 'die Temperatur'
        }
        if (valueType === 'distance') {
            return 'die Distanz'
        }
        return '';
    }
}
