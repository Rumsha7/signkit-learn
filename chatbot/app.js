/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var $ = require('jquery');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

server.post('/api/messages', connector.listen());

// var connector = new builder.ChatConnector({
//     appId: 'ca32b1be-28c8-44eb-a032-7928e368ff33',
//     appPassword: 'sydzdwESN3$\mFDLZ7857+}',
//     stateEndpoint: process.env.BotStateEndpoint,
//     openIdMetadata: process.env.BotOpenIdMetadata 
// });

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);

// Make sure you add code to validate these fields
// var luisAppId = 'abb16109-f82e-436f-8084-7f7c1bdee960';
// var luisAPIKey = 'c526a91e390d47a7a4c6a6fe2688fd4c';
// var luisAPIHostName = 'westus.api.cognitive.microsoft.com';

// var LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;
var LuisUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/abb16109-f82e-436f-8084-7f7c1bdee960?subscription-key=c526a91e390d47a7a4c6a6fe2688fd4c&verbose=true&timezoneOffset=0&';
// Main dialog with LUIS

// var locationDialog = require('botbuilder-location');
// bot.library(locationDialog.createLibrary("Ak0d04qO1QMPwmpx5YANEoS-HzRRjXKmWiezngPonvTXt3OYrCDZJcKhLRNPb5r7"));

var recognizer = new builder.LuisRecognizer(LuisUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })


// .matches('botprofile.hobbies',(session,args) => {
//     session.send("HELLO");
//     session.send("I like arts and crafts and knitting.");
// })

// .matches('literature',(session,args) => {
//     session.send("I don't read any books. But that sounds interesting.");
// })

.matches('greetings',(session,args) => {
    //session.send(session.message.entity);
    session.send('Hello! :) \nHow are you doing?');
})

.matches('good',(session,args) => {
    //session.send(session.message.entity);
    session.send('That\'s good! What would you like to talk about today?');
})

.matches('yes',(session,args) => {
    //session.send(session.message.entity);
    session.send('Me too! Winter is my favorite season!');
})

.matches('no',(session,args) => {
    //session.send(session.message.entity);
    session.send('Aww, winter is my favorite season!');
})


// .matches('test',(session,args) => {
//     session.send(session.message.text + " WITH ENTITY");  
// })

// .matches('test2',(session,args) => {
//     session.send(session.message.text + " WITHOUT ENTITY");  
// })

.matches('Weather.simple',(session,args) => {
    session.send('Winter is coming! \nAre you excited?');
    /* session.send("Weather request detected");
    getJSON('https://api.darksky.net/forecast/8847312d6b1d415e66c4e8b42961d5a5/40.3440,-74.6514', function(err, forecast) {
        if (err !== null) {
    session.send('Something went wrong: ');
  } else {
    session.send("received");
    }});*/ 
})

// .matches('user.location',(session,args) => {
//     session.send("Give user's location");
// })


.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});

bot.dialog('/', intents);    


//get random response takes an array of length 1-5 and returns a random response with equal probability
var getRandomResponse = function(args) {
    var resp;
    if (args.length == 1) {
        return args[0];
    }
    if (args.length == 2) {
        resp = Math.random() < 0.5? args[0]:  args[1];
        return resp;
    }
    if (args.length == 3) {
        resp = Math.random() < 0.33? args[0] :  Math.random() < 0.5? args[1]:  args[2];
        return resp;
    }
    if (args.length == 4) {
        resp = Math.random() < 0.25? args[0] :  Math.random() < 0.33? args[1] :  Math.random() < 0.5? args[2]:  args[3];
        return resp;
    }
    if (args.length == 5) {
        resp = Math.random() < 0.2? args[0] :  Math.random() < 0.25? args[1] :  Math.random() < 0.33? args[2] :  Math.random() < 0.5? args[3]:  args[4];
        return resp;
    }
};


var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

