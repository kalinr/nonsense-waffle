"use strict";

SpeechManager = {
  aUtterances: [],
  bSpeechEnabled: false,
  bSpeechSupported: false,
  bSpeaking: false,
  bListenSupported: false,
  bListening: false,
  oSpeechRecognition: null,
  oTriggers: [],//associative array (eventName:callback)

  init: function () {
    var bSpeechEnabledSaved,
      self = this;

    //TODO: make these if statements jslint compatible
    if ('speechSynthesis' in window) {//this browser can talk
      this.bSpeechSupported = true;

      //we blindly assume that if speechsynthesis is available, this browser must also have localStorage
      bSpeechEnabledSaved = JSON.parse(localStorage.getItem('bSpeechEnabled'));

      if (bSpeechEnabledSaved || bSpeechEnabledSaved === null || bSpeechEnabledSaved === undefined) {
        //if the stored value was true or if there was no stored value, default speech enabled to true
        this.bSpeechEnabled = true;
      }
    }

    if ('webkitSpeechRecognition' in window) {//this browser can listen
      this.bListenSupported = true;

      this.oSpeechRecognition = new webkitSpeechRecognition();
      this.oSpeechRecognition.continuous = true;
      this.oSpeechRecognition.interimResults = true;

      this.oSpeechRecognition.onresult = function(evt){
        self.onListenResult(evt);
      }

      console.log(this.oSpeechRecognition);
    }
  },

  saveState: function () {
    if (Storage !== undefined) {
      localStorage.setItem('bSpeechEnabled', this.bSpeechEnabled);
    }
  },

  //-----------------------Begin Speak functions--------------------------------
  speak: function (msg) {
    var elTemp,
      sentences,
      i,
      self = this;

    if (this.bSpeechEnabled && this.bSpeechSupported) {
      this.stopListening();
      this.bSpeaking = true;

      //get the browser to strip out all the html from the msg
      elTemp = document.createElement("DIV");
      elTemp.innerHTML = msg;
      msg = elTemp.textContent || elTemp.innerText || "";

      this.aUtterances = [];
      speechSynthesis.cancel();//cancel anything that was playing previously

      //this deals with a bug in google chrome where it can't speak long texts in one shot, so we break the string into sentences
      //TODO: deal with situations where a single sentence is more than 160 or so characters
      sentences = msg.split(". ");
      for (i = 0; i < sentences.length; i++) {
        this.aUtterances[i] = new SpeechSynthesisUtterance();
        this.aUtterances[i].text = sentences[i];
        speechSynthesis.speak(this.aUtterances[i]);
      }

      //listen to the end of only the final utterance so we know when they are all done
      this.aUtterances[this.aUtterances.length - 1].onend = function () {
        self.stopSpeaking();
      };
    }
  },

  //stop any speech currently happening
  stopSpeaking: function () {
    speechSynthesis.cancel();
    this.bSpeaking = false;
    this.trigger('speakingStopped');
  },
  //-----------------------End Speak functions--------------------------------

  //-----------------------Begin Listen functions--------------------------------
  listen: function () {
    this.stopSpeaking();

    console.log("startListening!!!!");

    this.oSpeechRecognition.start();
  },

  onListenResult: function(evt) {
    var i,
      sNewText = "",
      isFinal = false;

    console.log(evt);

    //loop through all results and concatenate them together (usually there's only one but if the API is sure about
    //the first one and still thinking about the second one, it gives us a second so we add that to the string
    for (i = 0; i < evt.results.length; i++) {
      //take only the first option from each result as that is supposed to be the most likely to be correct
      sNewText += evt.results[i][0].transcript;

      console.log(evt.results[i][0]);
      //if anything is considered final, set it as final
      if (evt.results[i].isFinal) {

        console.log("isfinal ture");
        isFinal = true;
      }
    }


    this.trigger('listenResult', {sNewText: sNewText, isFinal: isFinal});

    //once isFinal is true, Google Chrome just stops accepting voice input so we have no choice but to abandon ship
    //the user has to stop talking for a few seconds to get it to send isFinal as true
    if (isFinal) {
      console.log("stopping listening");
      this.stopListening();
    }
  },

  stopListening: function () {
    this.oSpeechRecognition.stop();
    this.bSpeaking = false;
    console.log("triggering listeningStopped");
    this.trigger('listeningStopped');
  },
  //-----------------------End listening functions--------------------------------

  //-----------------------Begin event handling--------------------------------
  //add an event listener
  on: function(event, callback) {
    if (!this.oTriggers[event]) {
      this.oTriggers[event] = [];
    }
    this.oTriggers[event].push(callback);
  },

  //trigger an event
  trigger: function(event, params) {
    var i;
    if (this.oTriggers[event]) {
      for (i in this.oTriggers[event] ) {
        this.oTriggers[event][i](params);
      }
    }
  },
  //-----------------------End event handling--------------------------------

  //-----------------------Begin enable/disable--------------------------------
  disable: function () {
    this.bSpeechEnabled = false;
    if (this.bSpeechSupported) {
      speechSynthesis.cancel();
    }
    this.saveState();
  },

  enable: function () {
    this.bSpeechEnabled = true;
    this.saveState();
  },

  toggleEnabled: function () {
    if (this.bSpeechEnabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.bSpeechEnabled;
  }
  //-----------------------End enable/disable--------------------------------

}