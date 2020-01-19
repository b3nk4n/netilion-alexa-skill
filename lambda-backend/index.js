/**
 * Prototype NodeJS AWS Lambda backend to handle intents from the Netilion Alexa
 * skill using  the Alexa Skills Kit SDK (v2).
 *
 * @author Benjamin Sautermeister
 */
const Alexa = require('ask-sdk-core');
const httpsService = require('./httpsService');
const i18n = require('./i18n/i18n')

const createOptions = function(path) {
    return {
        hostname: 'api.staging-env.netilion.endress.com',
        path,
        headers: {
          'Authorization': 'Basic XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          'Api-Key': 'XXXXXXXXXX'
        }
    }
}

const handleIntent = async function (handlerInput, tag, valueType) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    try {
        let response = await httpsService.getAsJson(
            createOptions('/v1/instrumentations?tag=' + encodeURIComponent(tag))
        );

        if (!response.instrumentations || response.instrumentations.length === 0) {
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('UNRESOLVED_INSTRUMENTATION', tag))
                .getResponse();
        }
        const instrumentationId = response.instrumentations[0].id;
        console.log(instrumentationId);

        response = await httpsService.getAsJson(
            createOptions('/v1/assets?instrumentation_id=' + instrumentationId)
        );

        if (!response.assets || response.assets.length === 0) {
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('UNRESOLVED_ASSET', tag))
                .getResponse();
        }
        const assetId = response.assets[0].id;
        console.log(assetId);

        response = await httpsService.getAsJson(
            createOptions('/v1/assets/' + assetId + '/values')
        );

        if (!response.values || response.values.length === 0) {
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('UNRESOLVED_VALUE', tag))
                .getResponse();
        }

        const value = response.values.find(x => x.key === valueType);

        if (!value) {
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('UNRESOLVED_VALUE_TYPE', valueType, tag))
                .getResponse();
        }

        response = await httpsService.getAsJson(
            createOptions('/v1/units/' + value.unit.id)
        );

        console.log(response);

        const lngResource = i18n.getLanguageResource(handlerInput.requestEnvelope.request.locale);
        const unit = lngResource.mapUnit(response);
        const valueTypeWithArticle = lngResource.mapValueTypeWithArticle(valueType);

        return handlerInput.responseBuilder
            .speak(requestAttributes.t('RESPONSE', valueTypeWithArticle, tag, value.value, unit))
            .getResponse();
    } catch(error) {
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('ERROR', tag))
            .getResponse();
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        console.log(handlerInput);
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('LAUNCH');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const NetilionLevelIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NetilionLevelIntent';
    },
    async handle(handlerInput) {
        console.log(handlerInput);
        const tag = handlerInput.requestEnvelope.request.intent.slots.tag.value;
        return await handleIntent(handlerInput, tag, 'level');
    }
};
const NetilionTemperatureIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NetilionTemperatureIntent';
    },
    async handle(handlerInput) {
        console.log(handlerInput);
        const tag = handlerInput.requestEnvelope.request.intent.slots.tag.value;
        return await handleIntent(handlerInput, tag, 'temperature');
    }
};
const NetilionDistanceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NetilionDistanceIntent';
    },
    async handle(handlerInput) {
        console.log(handlerInput);
        const tag = handlerInput.requestEnvelope.request.intent.slots.tag.value;
        return await handleIntent(handlerInput, tag, 'distance');
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('STOP');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('DEBUG_REFLECT', intentName);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.stack}`);
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('UNHANDLED_ERROR');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        NetilionLevelIntentHandler,
        NetilionTemperatureIntentHandler,
        NetilionDistanceIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addRequestInterceptors(i18n.LocalizationInterceptor)
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
