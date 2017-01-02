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