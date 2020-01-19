# netilion-alexa-skill
A prototype Alexa Skill using NodeJS backend to ask Alexa for sensor values of E+H Netilion via REST API


## Setup

1. Create a new Skill in the [Alexa Developer Console](https://developer.amazon.com).
    - Set a proper invocation name containing at least two words for your Skill, such as "My Netilion".
    - Don't use any predefined template. Just start from scratch.
    - Select an Alexa-hosted NodeJS AWS Lambda backend.
2. Within the **Build** tab, import the Intents for the `vui/en-US` voice frontend, by selecting **Intents, Samples and Slots > Intents > JSON Editor**.
3. To also support additional languages, such as German, select the **Language Settings** in the Language picker dropdown in the top-right corner, and repeat *step 2* with `vui/de-DE`.
4. Navigate to the **Code** tab, and import the NodeJS backend code files from the `lambda-backend` into the `Skill Code/lambda` folder. Replace all existing files.
    - Replace the authorization and API key with your own credentials from [Netilion API (Staging)](https://api.staging-env.netilion.endress.com/doc/v1#/):
      ```javascript
      headers: {
        'Authorization': 'Basic XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        'Api-Key': 'XXXXXXXXXX'
      }
      ```
5. To verify whether your Skill is working, switch to the **Test** tab, and ask Alexa for any of the implemented Intents, such as *"Open \<Invocation Name\>"* or *"Ask \<Invocation Name\> what is the level of my tag \<Tag Name\>"*


## Future Work

- To allow custom authentication and to remove the hard-coded Autorization and API-key information, [Account Linking](https://developer.amazon.com/en-US/docs/alexa/account-linking/understand-account-linking.html) would be required to enable user authentication via the Amazon Alexa app.
