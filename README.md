# Agent Assisted Payments Flex Plugin

## Setup Dependencies

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Make sure to install the serverless and flex cli plugins

```bash
twilio plugins:install @twilio-labs/plugin-serverless
twilio plugins:install @twilio-labs/plugin-flex
```

## Setup Backend

Install the backend dependencies by running `npm install`:

```bash
cd pay-backend

# If you use npm
npm install
```

## Create Sync Service

`twilio api:sync:v1:services:create --friendly-name=payments`

In the Twilio Console, create an API Key for your Sync service: https://www.twilio.com/console/sync/project/api-keys/create. Save the values for the next step.

## Voice Configuration

Enable your <Pay /> connector on https://www.twilio.com/console/voice/pay-connectors
Enable PCI mode for your account on https://www.twilio.com/console/voice/settings
Enter the unique name of your Payment Connector as an environment variable called "PAYMENT_CONNECTOR" in https://www.twilio.com/console/functions/configure

## Setup env file

```bash
cp .env.example .env

#Populate environment values (switch out .env for .env.stage, .env.prod, etc)
twilio serverless:deploy --env .env
```

## Setup Flex Plugin

Install the dependencies by running `npm install`:

```bash
cd ../plugin-voice-payments

cp public/appConfig.example.js public/appConfig.js
# Add your account SID

cp .env.example .env
#add in the runtime url from previous backend deployment

# If you use npm
npm install
```

This plugin uses a localStorage value to block loading unless the flag is set.

```
VoicePaymentsPlugin to true
```

The pay location can also be modified at run time with an additional localStorage flag

```
VoicePaymentsPluginLocation to one of panel2, panel3, taskinfo
```

## Development

In order to develop locally, you can use the Webpack Dev Server by running:

```bash
cd plugin-pay

npm start
```

When you make changes to your code, the browser window will be automatically refreshed.

## Deploy

Once you are happy with your plugin, you have to bundle it in order to deploy it to Twilio Flex.

Run the following command to start the bundling:

```bash
twilio flex:plugins:deploy
```

Afterwards, you'll find in your project a `build/` folder that contains a file with the name of your plugin project. For example, `plugin-example.js`. Take this file and upload it into the Assets part of your Twilio Runtime.

Note: Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex to provide them globally.
