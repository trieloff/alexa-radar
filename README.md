# Alexa Radar

A small Alexa skill that looks for upcoming travel on Tripit.

# Installation

Requires node.js and AWS CLI. Runs on AWS Lamdba.

```
npm install --save request
npm install --save alexa-sdk
zip alexa.zip -r node_modules index.js
aws --region eu-west-1 lambda update-function-code --function-name arn:aws:lambda:eu-west-1:$YOUR_ARN:function:Radar --zip-file fileb://$PWD/alexa.zip
```

# Authentication

TripIt uses OAuth 1.0 and Amazon only supports OAuth 2.0 for account linking. This means, at the current state, you need to [request enabling basic authentication, as described in the TripIt API documentation](http://tripit.github.io/api/doc/v1/#authentication_section).

# Interaction Model

This is the *German* interaction model, so try your best accent imitation, or simply change the phrases to the English equivalent.

## Intent Schema
```
{
  "intents": [
    {
      "intent": "LocationIntent",
      "slots": [
        {
          "name": "Name",
          "type": "AMAZON.DE_FIRST_NAME"
        }
      ]
    },
    {
      "intent": "AMAZON.HelpIntent"
    },
    {
      "intent": "AMAZON.StopIntent"
    },
    {
      "intent": "AMAZON.CancelIntent"
    }
  ]
}
```

## Sample Utterances
```
LocationIntent wo ist {Name}
LocationIntent finde {Name}
LocationIntent suche {Name}
LocationIntent was ist der Aufenthaltsort von {Name}
LocationIntent wo hast Du {Name} zuletzt gesehen
```