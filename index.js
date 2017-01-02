'use strict';

var Alexa = require('alexa-sdk');
var request = require("request");

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    var locale = event.request.locale
    console.log(event)
    if (locale == 'de-DE'){
        alexa.registerHandlers(DEhandlers);
    } else {
        alexa.registerHandlers(UShandlers);
    }
    
    console.log("Hey!");
    alexa.execute();
};

var makeTrip = function(json) {
  return {
    "destination": json.PrimaryLocationAddress.city,
    "start": new Date(json.start_date),
    "starts": Math.floor((new Date(json.start_date) - new Date()) / (1000*60*60*24)),
    "end": new Date(json.end_date),
    "ends": Math.ceil((new Date(json.end_date) - new Date()) / (1000*60*60*24)),
    "upcoming": new Date() < new Date(json.start_date),
    "ongoing": new Date() > new Date(json.start_date)
  };
}

var tripSorter = function(trip1, trip2) {
  return trip1.start > trip2.start;
}

var upcoming = function(trip) {
  return trip.upcoming;
}

var ongoing = function(trip) {
  return trip.ongoing;
}

function getLocation(name, trips) {
  if(trips.filter(ongoing).length > 0) {
    return name + "ist unterwegs in " + trips[0].destination + ". " + getReturn(name, trips);
  } else {
    return name + " ist zu Hause. " + getNextTrip(name, trips);
  }
}

function getNextTrip(name, trips) {
  if (trips.filter(upcoming).length == 0) {
    return name + " hat keine weiteren Reisen geplant.";
  } else {
    return "Die nächste Reise für " + name + " beginnt in " + trips[0].starts + " Tagen und geht nach " + trips[0].destination + ".";
  }
}

function getReturn(name, trips) {
  if (trips.filter(ongoing).length == 0) {
    return name + " ist nicht unterwegs. Guck doch mal unter dem Sofa.";
  } else {
    return name + " kommt in " + trips[0].ends + " Tagen aus " + trips[0].destination + " wieder.";
  }
}

var DEhandlers = {
    'LaunchRequest': function () {
        var speechOutput = "Wen möchtest Du finden?"
        var reprompt = "Wen suchst Du?";
        this.emit(':ask', speechOutput, reprompt);
    },

    'LocationIntent': function () {
        // Get users name
        var userName = this.event.request.intent.slots.Name.value;
        var alexa = this;
        
        
        if ((""+userName).match(/Lars/i)==null) {
          this.emit(":tell", "Entschuldige, ich kann im Moment nur Lars finden. Ich weiss nicht, wer " + userName + " ist.");
        }
        
        console.log("Making request to TripIt");
        
        request("https://api.tripit.com/v1/list/trip?format=json", function(error, response, body) {
          console.log("Response received");
          if (!error && response.statusCode == 200) {
            var trips = JSON.parse(body).Trip.map(makeTrip).sort(tripSorter);
            console.log("I got " + trips.length + " trips. " + trips.filter(ongoing).length + " in progress, " + trips.filter(upcoming).length + " upcoming.");
            
            alexa.emit(":tell", getLocation(userName, trips));            
          } else {
            console.log("Error: " + error);
            alexa.emit(':tell', "Aua. Es ist ein Fehler aufgetreten.")
            //this.emit(":tell", "Es ist ein Fehler aufgetreten.");
          }
        }).auth(process.env.TRIPIT_USER, process.env.TRIPIT_PASSWORD, true);
        console.log("Returning value.");
    },
    
    'ReturnIntent': function () {
        // Get users name
        var userName = this.event.request.intent.slots.Name.value;
        var alexa = this;
        
        
        
        
        if ((""+userName).match(/Lars/i)==null) {
          this.emit(":tell", "Entschuldige, ich kann im Moment nur Lars finden.");
        }
        
        console.log("Making request to TripIt");
        
        request("https://api.tripit.com/v1/list/trip?format=json", function(error, response, body) {
          console.log("Response received");
          if (!error && response.statusCode == 200) {
            var trips = JSON.parse(body).Trip.map(makeTrip).sort(tripSorter);
            console.log("I got " + trips.length + " trips. " + trips.filter(ongoing).length + " in progress, " + trips.filter(upcoming).length + " upcoming.");
            
            alexa.emit(":tell", getReturn(userName, trips));            
          } else {
            console.log("Error: " + error);
            alexa.emit(':tell', "Aua. Es ist ein Fehler aufgetreten.")
            //this.emit(":tell", "Es ist ein Fehler aufgetreten.");
          }
        }).auth(process.env.TRIPIT_USER, process.env.TRIPIT_PASSWORD, true);
        console.log("Returning value.");
      },
      
    'TravelIntent': function () {
        // Get users name
        var userName = this.event.request.intent.slots.Name.value;
        var alexa = this;
        
        
        
        if ((""+userName).match(/Lars/i)==null) {
          this.emit(":tell", "Entschuldige, ich kann im Moment nur Lars finden.");
        }
        
        console.log("Making request to TripIt");
        
        request("https://api.tripit.com/v1/list/trip?format=json", function(error, response, body) {
          console.log("Response received");
          if (!error && response.statusCode == 200) {
            var trips = JSON.parse(body).Trip.map(makeTrip).sort(tripSorter);
            console.log("I got " + trips.length + " trips. " + trips.filter(ongoing).length + " in progress, " + trips.filter(upcoming).length + " upcoming.");
            
            alexa.emit(":tell", getNextTrip(userName, trips));            
          } else {
            console.log("Error: " + error);
            alexa.emit(':tell', "Aua. Es ist ein Fehler aufgetreten.")
            //this.emit(":tell", "Es ist ein Fehler aufgetreten.");
          }
        }).auth(process.env.TRIPIT_USER, process.env.TRIPIT_PASSWORD, true);
        console.log("Returning value.");
      },

    'AMAZON.HelpIntent': function () {
        var speechOutput = "Frage mich nach einer Person, und ich sage Dir, wo sie ist.";
        var reprompt = "Wen möchtest Du finden?";
        this.emit(':ask', speechOutput, reprompt);

    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Tschüß!');
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Bis bald!');
    }

  }