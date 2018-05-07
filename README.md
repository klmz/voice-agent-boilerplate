# Voice Agent Boilerplate
This repo serves as a boilerplate for a dialogflow voice agent for the Google Assisant.

## How to run
After cloning this repo run ```npm install``` to install all the dependencies.
Then to serve a local server run ```npm start```, this will watch the ```src``` folder for changes and reboot if required.
To build use ```npm run build``` which will result in a es2015 compatible js file in the ```dist``` folder.

## How to use this code

### Handlers
The boilerplate gives you a framework to quickly create a fullfilment server for Dialogflow.
The only thing you have to do is implement the ```RouteHandler``` class, 
see ```WelcomeHandler``` for an example.
Once implemented add the route handler to ```index.js```.
The framework will select the right handler based on the intent received from Dialogflow.

### Prompts
To be able to be multilingual all possible prompts are gathered in languages files. 
See ```/main/prompts/``` for an example.

## Heroku deploy
TODO describe how to easily deploy the fulfillment server to Heroku.