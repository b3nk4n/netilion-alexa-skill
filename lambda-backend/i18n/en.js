module.exports = {
    translation : {
        'LAUNCH' : 'Hi, I\' m Netilion. You can ask for the level, temperature or distance of a device via its tag. What would you like to check?',
        'RESPONSE': '%s for %s is %s %s',
        'UNRESOLVED_INSTRUMENTATION': 'I wasn\'t able to find instumentation data for the tag %s',
        'UNRESOLVED_ASSET': 'I wasn\'t able to find asset data for the tag %s',
        'UNRESOLVED_VALUE': 'I wasn\'t able to find values data for the tag %s',
        'UNRESOLVED_VALUE_TYPE': 'I wasn\'t able to find the value for %s of the tag %s',
        'HELP': 'You can ask me for the level, temperature or distance of a device via its tag. How can I help?',
        'STOP': 'Goodbye!',
        'DEBUG_REFLECT': 'You just triggered %s',
        'ERROR': 'I wasn\'t able to find data for the tag %s',
        'UNHANDLED_ERROR': 'Sorry, I had trouble doing what you asked. Please try again.'
    },
    mapUnit: function(unitObject) {
        if (!unitObject || !unitObject.code || !unitObject.name) {
            return '';
        }
        if (unitObject.code === 'millimetre') {
            return 'millimeters'
        }
        if (unitObject.code === 'centimetre') {
            return 'centimeters'
        }
        return unitObject.name;
    },
    mapValueTypeWithArticle: function(valueType) {
        return `the ${valueType}`;
    }
}
